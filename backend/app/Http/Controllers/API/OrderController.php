<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use App\Customer;
use App\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OrderController extends Controller
{
    /**
     * 基本搜索
     * @param Request $request
     * @return QueryBuilder|self
     */
    public function baseSearch(Request $request) {
        $query = QueryBuilder::for(Order::query())
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
                'product'
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
            'number'       => [
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
                'ip'           => $request->ip(),
                'agent'        => $request->userAgent(),
            ])
            ->log("添加 '{$request->number}' 订单");

        $fileUrl = $request->input('file_url', null);

        if ($fileUrl) {
            // 队列，下载素材
        }

        return response()->json([
            'message'   => '添加成功',
        ], 200);
    }
}
