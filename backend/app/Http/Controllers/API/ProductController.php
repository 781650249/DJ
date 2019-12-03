<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use App\Imports\ImportToArray;
use App\Products;
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
            );

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
            'double_side' => 'boolean',
            'purchase_price' => [
                'numeric',
                'max:99999999'
            ],
            'title' => [
                'required',
                'max:255'
            ],
            'title_en' => 'max:255',
            'weight' => 'numeric',
            'sku' => [
                'required',
                'max:255',
                'unique:products'
            ],
            'note' => ['max:800']
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
                'old_data' => [
                    'double_side'    => $product->double_side,
                    'purchase_price' => $product->purchase_price,
                    'title'          => $product->title,
                    'title_en'       => $product->title_en,
                    'weight'         => $product->weight,
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
            'double_side' => 'boolean',
            'purchase_price' => [
                'numeric',
                'max:99999999'
            ],
            'title' => [
                'required',
                'max:255'
            ],
            'title_en' => 'max:255',
            'weight' => 'numeric',
            'sku' => [
                'required',
                'max:255',
                Rule::unique('products')
                    ->where(function($query) use ($id) {
                        $query->where('id', '<>', $id);
                    })
            ],
            'note' => ['max:800']
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
                    'sku'            => $product->sku,
                    'note'           => $product->note
                ],
                'new_data' => [
                    'double_side'    => $request->double_side,
                    'purchase_price' => $request->purchase_price,
                    'title'          => $request->title,
                    'title_en'       => $request->title_en,
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
     * @param Request $request
     * @return array|\Illuminate\Http\JsonResponse
     */
    public function import(Request $request) {
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

    }
}
