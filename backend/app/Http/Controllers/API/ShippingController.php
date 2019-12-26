<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use App\Imports\ImportToArray;
use App\OrderShipping;
use App\Rules\DateRule;
use App\Util\Util;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ShippingController extends Controller
{
    //
    public function baseSearch(Request $request) {
        return QueryBuilder::for(OrderShipping::query())
            ->allowedFilters(
                'track_number',
                'order_number',
                AllowedFilter::scope('created_at'),
                AllowedFilter::scope('has_order')
            )
            ->defaultSort('-created_at');
    }

    public function index(Request $request) {
        $query = $this->baseSearch($request);

        $pageSize = $request->input('page_size', 10);

        return $query
            ->with(['order'])
            ->paginate($pageSize);
    }

    /**
     * 导入
     * @param Request $request
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

        if (count($data) > 1) {
            return response()->json([
                'message' => '仅支持一个工作表导入，请删除多余的工作表后再试'
            ], 422);
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
                        !array_key_exists('order_number', $item) ||
                        !array_key_exists('track_number', $item)
                    ) {
                        return response()
                            ->json([
                                'message' => '导入失败',
                                'error'   => '您上传的表缺少关键标题，请核对，或者下载模板并根据模板提示填写，然后上传！'
                            ], 422);
                    }

                    $dataValidator = Validator::make($item, [
                        'order_number'  => [
                            'required',
                            'max:32'
                        ],
                        'track_number'  => [
                            'required',
                            'max:32'
                        ]
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

                    $trackNumber = $item['track_number'];
                    $orderNumber = $item['order_number'];

                    $note = $item['note'] ?? null;

                    $shipping = OrderShipping::where('track_number', $trackNumber)
                        ->first();

                    if (empty($shipping)) {
                        $shipping = OrderShipping::create([
                            'track_number'  => $trackNumber,
                            'order_number'  => $orderNumber,
                            'note'          => $note
                        ]);

                        activity(ActivityLog::TYPE_SHIPPING_IMPORT_ADD)
                            ->performedOn($shipping)
                            ->withProperties([
                                'ip'        => $request->ip(),
                                'agent'     => $request->userAgent(),
                                'file_name' => $fileName,
                                'file_type' => $fileType,
                                'file_size' => $fileSize
                            ])
                            ->log('导入物流订单时，添加物流订单');

                        $newCount++;
                    }
                    else {
                        $shipping->update([
                            'order_number'  => $orderNumber,
                            'note'          => $note
                        ]);

                        activity(ActivityLog::TYPE_SHIPPING_IMPORT_UPDATE)
                            ->performedOn($shipping)
                            ->withProperties([
                                'ip'        => $request->ip(),
                                'agent'     => $request->userAgent(),
                                'file_name' => $fileName,
                                'file_type' => $fileType,
                                'file_size' => $fileSize
                            ])
                            ->log("导入物流订单时，更新 {$shipping->order_number} 的物流订单");

                        $updateCount++;
                    }

                    $successTimes++;
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

        activity(ActivityLog::TYPE_SHIPPING_IMPORT)
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
}
