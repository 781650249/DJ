<?php

namespace App\Http\Controllers\API;

use App\Products;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
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

        Products::create($request->all());

        return response([
            'success'   => true,
            'message'   => '创建成功'
        ], 200);
    }
}
