<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use App\Customer;
use App\Imports\ImportToArray;
use App\Jobs\DownloadZipFileJob;
use App\Order;
use App\Rules\DateRule;
use App\Util\Util;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller {
    /**
     * 基本搜索
     * @param Request $request
     * @return QueryBuilder|self
     */
    public function baseSearch(Request $request) {
        $query = QueryBuilder::for (Order::query())
            ->allowedFilters(
                AllowedFilter::exact('status'),
                AllowedFilter::scope('email'),
                AllowedFilter::scope('name')
            )
            ->defaultSort('-created_at');

        return $query;
    }

    /**
     * 获取订单列表
     * @param Request $request
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function index(Request $request) {
        $query = $this->baseSearch($request);

        $pageSize = $request->input('page_size', 10);

        return $query
            ->with([
                'customer',
                'product',
                'zipFile',
                'unZipFiles',
                'finishFiles'
            ])
            ->paginate($pageSize);
    }

    /**
     * 添加订单
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {
        $inArray = [];

        foreach (Order::ORDER_STATUS as $key => $item) {
            $inArray[] = $key;
        }

        $validator = Validator::make($request->all(), [
            'name'         => 'required',
            'oid'          => [
                'required',
                'unique:orders'
            ],
            'status'       => [
                'required',
                Rule::in($inArray)
            ],
            'file_url'     => 'url',
            'note'         => 'max:140',
            'sku'          => [
                'required',
                'max:32'
            ],
            'quantity'     => [
                'required',
                'numeric'
            ],
            'customer_id'  => ['exists:customers,id'],
            'published_at' => 'date',
            'produced_at'  => 'date',
            'created_at'   => [
                'required',
                'date'
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '添加失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $order = Order::create($request->all());

        activity(ActivityLog::TYPE_ORDER_ADD)
            ->performedOn($order)
            ->withProperties([
                'ip'    => $request->ip(),
                'agent' => $request->userAgent(),
            ])
            ->log("添加 '{$request->number}' 订单");

        $fileUrl = $request->input('file_url', null);

        if ($fileUrl) {
            $this->dispatch(new DownloadZipFileJob($order));
        }

        return response()->json([
            'message' => '添加成功',
        ], 200);
    }

    /**
     * 导入订单
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(Request $request) {
        // excel格式
        $acceptFileType = [
            'application/vnd.ms-office',
            'application/vnd.ms-excel',
            'application/octet-stream',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        $acceptFileTypeStr = implode(",", $acceptFileType);

        $validator = Validator::make($request->all(), [
            'files' => [
                'required',
                "mimetypes:{$acceptFileTypeStr}",
                'max:10240'
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '导入失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $file = $request->file('files');

        $fileName = $file->getClientOriginalName();
        $fileType = $file->getMimeType();
        $fileSize = $file->getSize();

        $successTimes = 0;
        $errorTimes = 0;
        $errors = [];
        $newCount = 0;  // 新增个数
        $updateCount = 0;   // 修改个数

        try {
            $import = new ImportToArray();
            $data = Excel::toArray($import, $file);
        }
        catch (\Exception $exception) {
            return response()->json([
                'message' => '文件解析失败',
                'error'   => $exception->getMessage()
            ], 422);
        }

        // return $data;
        if (count($data) > 1) {
            return response()->json([
                'message' => '仅支持一个工作表导入，请删除多余的工作表后再试'
            ], 422);
        }

        $statusArray = [];

        foreach (Order::ORDER_STATUS as $key => $item) {
            $statusArray[] = $key;
        }

        // 循环，不支持分页
        // 最多1w单导入
        foreach ($data as $sheet) {
            if (count($sheet) > 10000) {
                return response()
                    ->json([
                        'message' => '您要导入的订单超过10,000限制的量。'
                    ], 422);
            }

            foreach (collect($sheet)->chunk(500) as $chunkIndex => $items) {
                foreach ($items as $index => $item) {
                    if (
                        !array_key_exists('number', $item) ||
                        !array_key_exists('oid', $item) ||
                        !array_key_exists('sku', $item) ||
                        !array_key_exists('order_date', $item) ||
                        !array_key_exists('customer_name', $item) ||
                        !array_key_exists('customer_email', $item) ||
                        !array_key_exists('country', $item) ||
                        !array_key_exists('province', $item) ||
                        !array_key_exists('city', $item) ||
                        !array_key_exists('address1', $item) ||
                        !array_key_exists('phone', $item) ||
                        !array_key_exists('zip_code', $item)
                    ) {
                        return response()
                            ->json([
                                'message' => '导入失败',
                                'error'   => '您上传的表缺少关键标题，请核对，或者下载模板并根据模板提示填写，然后上传！'
                            ], 422);
                    }

                    $dataValidator = Validator::make($item, [
                        'oid'           => [
                            'required',
                            'max:64'
                        ],
                        'number'        => [
                            'required',
                            'max:64'
                        ],
                        'file_url'      => ['url'],
                        'published_at'  => [new DateRule],
                        'produced_at'   => [new DateRule],
                        'sku'           => ['max:64'],
                        'quantity'      => ['numeric'],
                        'order_date'    => [
                            'required',
                            new DateRule
                        ],
                        'customer_name' => ['required'],
                        'email'         => [
                            'email'
                        ],
                        'phone'         => [
                            'max: 32'
                        ],
                        'country'       => ['max:32'],
                        'province'      => ['max:32'],
                        'city'          => ['max:32'],
                        'address1'      => ['max:128'],
                        'address2'      => ['max:128'],
                        'address3'      => ['max:128'],
                        'zip_code'      => ['max:16']
                    ]);

                    $lineNum = ($chunkIndex * 500) + $index + 2;

                    if ($dataValidator->fails()) {
                        $errors[] = [
                            'line'  => $lineNum,
                            'error' => $dataValidator->errors()->first()
                        ];

                        $errorTimes++;
                        continue;
                    }

                    // 顾客字段
                    $customer = Customer::where([
                        'name'     => $item['customer_name'],
                        'email'    => $item['customer_email'],
                        'phone'    => $item['phone'],
                        'city'     => $item['city'],
                        'address1' => $item['address1'] ?? null
                    ])
                        ->first();

                    if (empty($customer)) {
                        $customer = Customer::create([
                            'name'     => $item['customer_name'],
                            'email'    => $item['customer_email'],
                            'phone'    => $item['phone'],
                            'city'     => $item['city'],
                            'address1' => $item['address1'] ?? null,
                            'country'  => $item['country'],
                            'province' => $item['province'],
                            'zip_code' => $item['zip_code'] ?? null,
                            'address2' => $item['address2'],
                            'address3' => $item['address3']
                        ]);

                        activity(ActivityLog::TYPE_IMPORT_ORDER_CREATE_CUSTOMER)
                            ->performedOn($customer)
                            ->withProperties([
                                'file_name' => $fileName,
                                'file_type' => $fileType,
                                'file_size' => $fileSize
                            ])
                            ->log('导入订单，添加新的顾客信息');
                    }
                    else {
                        $customer->update([
                            'country'  => $item['country'],
                            'province' => $item['province'],
                            'zip_code' => $item['zip_code'],
                            'address2' => $item['address2'],
                            'address3' => $item['address3']
                        ]);

                        activity(ActivityLog::TYPE_IMPORT_ORDER_UPDATE_CUSTOMER)
                            ->performedOn($customer)
                            ->withProperties([
                                'file_name' => $fileName,
                                'file_type' => $fileType,
                                'file_size' => $fileSize
                            ])
                            ->log("导入订单时，更新顾客 {$customer->name} 的信息");
                    }

                    $order = Order::where('oid', $item['oid'])->first();

                    if (empty($order)) {
                        $order = Order::create([
                            'oid'          => $item['oid'],
                            'number'       => $item['number'],
                            'file_url'     => $item['file_url'] ?? null,
                            'status'       => Order::STATUS_UN_DOWNLOAD,
                            'note'         => $item['note'] ?? null,
                            'published_at' => $item['published_at'] ? Util::formatExcelDate($item['published_at']) : null,
                            'produced_at'  => $item['produced_at'] ? Util::formatExcelDate($item['produced_at']) : null,
                            'sku'          => $item['sku'],
                            'quantity'     => $item['quantity'],
                            'customer_id'  => $customer->id,
                            'created_at'   => Util::formatExcelDate($item['order_date'])
                        ]);

                        activity(ActivityLog::TYPE_IMPORT_ORDER_CREATE)
                            ->performedOn($order)
                            ->withProperties([
                                'file_name' => $fileName,
                                'file_type' => $fileType,
                                'file_size' => $fileSize
                            ])
                            ->log('导入订单时， 创建新的订单');

                        $newCount++;
                    }

                    else {
                        $order->update([
                            'number'       => $item['number'],
                            'file_url'     => $item['file_url'] ?? null,
                            'note'         => $item['note'] ?? null,
                            'published_at' => $item['published_at'] ? Util::formatExcelDate($item['published_at']) : null,
                            'produced_at'  => $item['produced_at'] ? Util::formatExcelDate($item['produced_at']) : null,
                            'sku'          => $item['sku'],
                            'quantity'     => $item['quantity'],
                            'customer_id'  => $customer->id,
                            'created_at'   => Util::formatExcelDate($item['order_date'])
                        ]);

                        activity(ActivityLog::TYPE_IMPORT_ORDER_UPDATE)
                            ->performedOn($order)
                            ->withProperties([
                                'file_name' => $fileName,
                                'file_type' => $fileType,
                                'file_size' => $fileSize
                            ])
                            ->log("导入订单时， 更新订单 {$order->oid}");

                        $updateCount++;
                    }

                    $successTimes++;

                    if ($order->file_url) {
                        $files = $order->unZipFiles()->get();

                        // 如果没有文件的话，推送到下载队列
                        if (count($files) == 0) {
                            dispatch(new DownloadZipFileJob($order));
                        }
                    }
                }
            }
        }

        if ($errorTimes == 0 && $successTimes > 0) {
            $logMsg = '导入成功';
        }

        elseif ($errorTimes > 0 && $successTimes > 0) {
            $logMsg = '导入部分成功';
        }

        elseif ($errorTimes > 0 && $successTimes == 0) {
            $logMsg = '导入失败';
        }
        else {
            $logMsg = '导入失败';
        }

        // 存储量有限， 直接窃取300条错误
        if (count($errors) > 300) {
            $newError = array_slice($errors, 0, 300);
        }
        else {
            $newError = $errors;
        }

        activity(ActivityLog::TYPE_IMPORT_ORDER)
            ->withProperties([
                'file_name'     => $fileName,
                'file_type'     => $fileType,
                'file_size'     => $fileSize,
                'success_count' => $successTimes,
                'error_count'   => $errorTimes,
                'new_count'     => $newCount,
                'update_count'  => $updateCount,
                'errors'        => $newError
            ])
            ->log($logMsg);

        return response()->json([
            'success_count' => $successTimes,
            'error_count'   => $errorTimes,
            'new_count'     => $newCount,
            'update_count'  => $updateCount,
            'message'       => $logMsg
        ], 200);
    }

    /**
     * 更新订单状态
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateStatus(Request $request, $id) {
        $inArray = [];

        foreach (Order::ORDER_STATUS as $key => $item) {
            if ($item === Order::STATUS_UN_DOWNLOAD || $item === Order::STATUS_DOWNLOADED) {
                continue;
            }

            $inArray[] = $key;
        }

        $validator = Validator::make($request->all(), [
            'status' => [
                'required',
                Rule::in($inArray)
            ]
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '修改失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $order = Order::find($id);

        $oldStatus = $order->status;

        if (empty($order)) {
            return response()->json([
                'message' => '修改失败',
                'error'   => '未找到该ID的订单'
            ]);
        }

        $order->update([
            'status' => $request->status
        ]);

        activity(ActivityLog::TYPE_ORDER_UPDATE_STATUS)
            ->performedOn($order)
            ->withProperties([
                'ip'         => $request->ip(),
                'agent'      => $request->userAgent(),
                'old_status' => $oldStatus,
                'new_status' => $request->status
            ])
            ->log('将该订单状态改为：' . $request->status);

        return response()->json([
            'message' => '修改成功'
        ], 200);
    }

    /**
     * 上传完成图
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadFinishImg(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'files' => ['required', 'mimes:jpeg,bmp,png,jpg'],
            'note'  => ['max:140']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message'   => '上传失败',
                'error'     => $validator->errors()->first()
            ], 422);
        }
    }
}
