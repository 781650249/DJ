<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use App\Imports\ImportToArray;
use App\Products;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Activitylog\Contracts\Activity;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\Filters\Filter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    /**
     * 基本搜索
     * @param Request $request
     * @return QueryBuilder
     */
    public function baseSearch(Request $request) {
        $query = QueryBuilder::for(Products::query())
            ->allowedFilters(
                AllowedFilter::exact('double_side'),
                AllowedFilter::scope('keyword'),
                AllowedFilter::scope('weight'),
                AllowedFilter::scope('purchase_price')
            )
        ->defaultSort('-created_at');

        return $query;
    }

    public function index(Request $request) {
        $query = $this->baseSearch($request);

        $pageSize = $request->input('page_size', 10);

        return $query->paginate($pageSize);
    }

    /**
     * 添加商品
     * 验证规则
     * 1、单双面， 接受boolean值（0, 1）
     * 2、采购价格， float值，最大值99999999
     * 3、标题，必填， 最大长度255
     * 4、英文标题，最大长度255
     * 6、重量，float数值， 最大值99999999
     * 7、sku, 必填，唯一
     * 8、备注, 最大长度800
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     */
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'double_side'    => 'boolean',
            'purchase_price' => [
                'numeric',
                'max:99999999'
            ],
            'title'          => [
                'required',
                'max:255'
            ],
            'title_en'       => 'max:255',
            'weight'         => 'numeric',
            'quantity'       => 'numeric',
            'sku'            => [
                'required',
                'max:255',
                'unique:products'
            ],
            'note'           => ['max:800']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '添加失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $product = Products::create($request->all());

        activity(ActivityLog::TYPE_PRODUCT_ADD)
            ->performedOn($product)
            ->withProperties([
                'ip'           => $request->ip(),
                'agent'        => $request->userAgent(),
                'data' => [
                    'double_side'    => $product->double_side,
                    'purchase_price' => $product->purchase_price,
                    'title'          => $product->title,
                    'title_en'       => $product->title_en,
                    'weight'         => $product->weight,
                    'quantity'       => $product->quantity,
                    'sku'            => $product->sku,
                    'note'           => $product->note
                ]
            ])
            ->log("添加了'{$request->sku}'这个商品");

        return response([
            'message'   => '创建成功'
        ], 200);
    }

    /**
     * 修改更新
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'double_side'    => 'boolean',
            'purchase_price' => [
                'numeric',
                'max:99999999'
            ],
            'title'          => [
                'required',
                'max:255'
            ],
            'title_en'       => 'max:255',
            'weight'         => 'numeric',
            'quantity'       => 'numeric',
            'sku'            => [
                'required',
                'max:255',
                Rule::unique('products')
                    ->where(function ($query) use ($id) {
                        $query->where('id', '<>', $id);
                    })
            ],
            'note'           => ['max:800']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '修改失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $product= Products::find($id);

        if (empty($product)) {
            return response()->json([
                'message' => '修改失败',
                'error'   => '未找到该ID的商品'
            ], 422);
        }

        // 记录到日志
        activity(ActivityLog::TYPE_PRODUCT_UPDATE)
            ->performedOn($product)
            ->withProperties([
                'ip'           => $request->ip(),
                'agent'        => $request->userAgent(),
                'old_data' => [
                    'double_side'    => $product->double_side,
                    'purchase_price' => $product->purchase_price,
                    'title'          => $product->title,
                    'title_en'       => $product->title_en,
                    'weight'         => $product->weight,
                    'quantity'       => $product->quantity,
                    'sku'            => $product->sku,
                    'note'           => $product->note
                ],
                'new_data' => [
                    'double_side'    => $request->double_side,
                    'purchase_price' => $request->purchase_price,
                    'title'          => $request->title,
                    'title_en'       => $request->title_en,
                    'quantity'       => $request->quantity,
                    'weight'         => $request->weight,
                    'sku'            => $request->sku,
                    'note'           => $request->note
                ]
            ])
            ->log("修改了{$request->sku}这个商品");

        $product->update([
            'double_side'    => $request->double_side,
            'purchase_price' => $request->purchase_price,
            'title'          => $request->title,
            'title_en'       => $request->title_en,
            'quantity'       => $request->quantity,
            'weight'         => $request->weight,
            'sku'            => $request->sku,
            'note'           => $request->note
        ]);

        return response()->json([
                'message'   => '修改成功'
            ], 200);
    }

    /**
     * 删除
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id) {
        $product = Products::find($id);

        if (empty($product)) {
            return response()->json([
                'message' => '删除失败',
                'error'   => '未找到该ID的商品'
            ], 422);
        }

        // 记录到log日志
        activity(ActivityLog::TYPE_PRODUCT_DELETE)
            ->performedOn($product)
            ->withProperties([
                'ip'           => $request->ip(),
                'agent'        => $request->userAgent(),
                'product_data' => [
                    'double_side'    => $product->double_side,
                    'purchase_price' => $product->purchase_price,
                    'title'          => $product->title,
                    'title_en'       => $product->title_en,
                    'weight'         => $product->weight,
                    'sku'            => $product->sku,
                    'note'           => $product->note
                ]
            ])
            ->log("删除'{$product->sku}'这个商品");

        $product->delete();

        return response()->json([
            'message'   => '删除成功'
        ], 200);

    }

    /**
     * 批量导入
     * 返回参数
     * {
     *   'success_count': $successTimes, // 导入成功数
     *   'error_count': $errorTimes,     // 导入失败数
     *   'new_count': $newCount,         // 新增的量
     *   'update_count': $updateCount,   // 更新的量
     *   'message': $logMsg              // 消息
     * }
     *
     * 日志纪录字段
     * {
     *   'file_name': '文件名称',
     *   'file_type': '文件类型',
     *   'file_size': '文件大小',
     *   'success_count': '成功数量',
     *   'error_count': '失败数量',
     *   'update_count': '更新数量',
     *   'errors': '错误数据'
     * }
     * @param Request $request
     * @return array|\Illuminate\Http\JsonResponse
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
            ], 200);
        }

        // 循环，不支持分页
        // 最多1w单导入
        foreach ($data as $sheet) {
            if (count($sheet) > 10000) {
                return response()
                    ->json([
                        'message' => '您要导入的商品超过10,000限制的量。'
                    ], 422);
            }

            foreach (collect($sheet)->chunk(500) as $chunkIndex => $items) {
                foreach ($items as $index => $item) {
                    if (
                        !array_key_exists('double_side', $item) ||
                        !array_key_exists('purchase_price', $item) ||
                        !array_key_exists('title', $item) ||
                        !array_key_exists('title_en', $item) ||
                        !array_key_exists('weight', $item) ||
                        !array_key_exists('quantity', $item) ||
                        !array_key_exists('sku', $item) ||
                        !array_key_exists('note', $item)
                    ) {
                        \activity(ActivityLog::TYPE_PRODUCT_IMPORT_FAILED)
                            ->withProperties([
                                'file_name' => $fileName,
                                'file_size' => $fileSize,
                                'file_type' => $fileType,
                                'total'     => count($sheet),
                            ])
                            ->log('缺少关键标题');

                        return response()
                            ->json([
                                'message' => '您上传的表缺少关键标题，请核对，或者下载模板并根据模板提示填写，然后上传！'
                            ], 422);
                    }

                    $doubleSide = $item['double_side'] ?? 0;
                    $purchasePrice = $item['purchase_price'];
                    $title = $item['title'];
                    $titleEn = $item['title_en'];
                    $weight = $item['weight'];
                    $quantity = $item['quantity'] ?? 0;
                    $sku = $item['sku'];
                    $note = $item['note'];

                    $lineNum = ($chunkIndex * 500) + $index + 2;

                    if (!is_numeric($purchasePrice)) {
                        $errorTimes[] = [
                            'line'    => $lineNum,
                            'message' => "'purchase_price' 不是个有效的数字"
                        ];

                        $errorTimes++;
                        continue;
                    }

                    if (!is_numeric($weight)) {
                        $errorTimes[] = [
                            'line'    => $lineNum,
                            'message' => "'weight' 不是个有效的数字"
                        ];

                        $errorTimes++;
                        continue;
                    }

                    if (!is_numeric($quantity)) {
                        $errorTimes[] = [
                            'line'    => $lineNum,
                            'message' => "'quantity' 不是个有效的数字"
                        ];

                        $errorTimes++;
                        continue;
                    }

                    if (!$title) {
                        $errorTimes[] = [
                            'line'    => $lineNum,
                            'message' => "'title' 不能为空"
                        ];

                        $errorTimes++;
                        continue;
                    }

                    if (!$sku) {
                        $errorTimes[] = [
                            'line'    => $lineNum,
                            'message' => "'sku' 不能为空"
                        ];

                        $errorTimes++;
                        continue;
                    }

                    $product = Products::where('sku', $sku)->first();

                    // 不为空时更新
                    if (!empty($product)) {

                        // 记录到日志
                        activity(ActivityLog::TYPE_PRODUCT_IMPORT_UPDATE)
                            ->performedOn($product)
                            ->withProperties([
                                'ip'           => $request->ip(),
                                'agent'        => $request->userAgent(),
                                'old_data' => [
                                    'double_side'    => $product->double_side,
                                    'purchase_price' => $product->purchase_price,
                                    'title'          => $product->title,
                                    'title_en'       => $product->title_en,
                                    'weight'         => $product->weight,
                                    'quantity'       => $product->quantity,
                                    'sku'            => $product->sku,
                                    'note'           => $product->note
                                ],
                                'new_data' => [
                                    'double_side'    => $doubleSide,
                                    'purchase_price' => $purchasePrice,
                                    'title'          => $title,
                                    'title_en'       => $titleEn,
                                    'quantity'       => $quantity,
                                    'weight'         => $weight,
                                    'sku'            => $sku,
                                    'note'           => $note
                                ]
                            ])
                            ->log("导入修改了 ’{$request->sku}‘ 这个商品");

                        $product->update([
                            'title'          => $title,
                            'title_en'       => $titleEn,
                            'double_side'    => $doubleSide,
                            'purchase_price' => $purchasePrice,
                            'weight'         => $weight,
                            'quantity'       => $quantity,
                            'note'           => $note
                        ]);

                        $updateCount++;
                        $successTimes++;
                    }
                    else {

                        $product = Products::create([
                            'title'          => $title,
                            'title_en'       => $titleEn,
                            'double_side'    => $doubleSide,
                            'purchase_price' => $purchasePrice,
                            'weight'         => $weight,
                            'quantity'       => $quantity,
                            'sku'            => $sku,
                            'note'           => $note
                        ]);

                        activity(ActivityLog::TYPE_PRODUCT_ADD)
                            ->performedOn($product)
                            ->withProperties([
                                'ip'           => $request->ip(),
                                'agent'        => $request->userAgent(),
                                'data' => [
                                    'double_side'    => $product->double_side,
                                    'purchase_price' => $product->purchase_price,
                                    'title'          => $product->title,
                                    'title_en'       => $product->title_en,
                                    'weight'         => $product->weight,
                                    'quantity'       => $product->quantity,
                                    'sku'            => $product->sku,
                                    'note'           => $product->note
                                ]
                            ])
                            ->log("导入添加了 '{$request->sku}' 这个商品");

                        $newCount++;
                        $successTimes++;
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

        \activity(ActivityLog::TYPE_PRODUCT_IMPORT)
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
     * 批量删除
     * 日志记录
     * {
     *   'sku': sku,
     *   'title': '标题'
     * }
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function batchDel(Request $request) {
        $ids = $request->input('ids', []);

        if (!is_array($ids)) {
            return response([
                'message' => '请求的参数’ids‘不是有效的数组',
                'code'    => -1
            ], 500);
        }

        if (count($ids) > 300) {
            return response([
                'message' => '将要删除的数据超过300条，操作被拒绝，请确认后再试！'
            ], 422);
        }

        $products = Products::whereIn('id', $ids)
            ->get();

        if (count($products) === 0) {
            return response([
                'message' => '要删除的数据不存在，请确认后再试！'
            ], 422);
        }

        if (count($products) !== count($ids)) {
            return response([
                'message' => '将要删除的数据和请求的参数不符，请刷新数据后再试！操作被拒绝。'
            ], 422);
        }

        $num = 0;
        foreach ($products as $product) {
            activity(ActivityLog::TYPE_PRODUCT_BATCH_DELETE)
                ->withProperties([
                    'title'      => $product->title,
                    'sku'        => $product->sku,
                    'deleted_at' => Carbon::now()
                ])
                ->log("批量删除中，删除了 '{$product->sku}' 这个商品");

            $product->delete();
            $num++;
        }

        \activity(ActivityLog::TYPE_PRODUCTS_BATCH_DEL)
            ->withProperties([
                'delete_count'  => $num,
            ])
            ->log("批量删除了 '{$num}' 个商品");

        return response([
            'message'      => '删除成功',
            'delete_count' => $num
        ], 200);
    }
}
