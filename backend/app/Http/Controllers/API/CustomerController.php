<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use App\Customer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class CustomerController extends Controller
{
    public function baseSearch(Request $request) {
        $query = QueryBuilder::for(Customer::query())
            ->allowedFilters(
                AllowedFilter::exact('country'),
                'name',
                'email'
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
     * 添加顾客信息
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'name'     => 'required',
            'email'    => [
                'required',
                'email'
            ],
            'phone'    => ['max:32'],
            'country'  => ['max:32'],
            'province' => ['max:32'],
            'city'     => ['max:32'],
            'address1' => ['max:128'],
            'address2' => ['max:128'],
            'address3' => ['max:128'],
            'zip_code' => ['max:16']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '添加失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $customer = Customer::where([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'address1' => $request->address1
        ])->first();

        if (!empty($customer)) {
            return response()->json([
                'message' => '添加失败',
                'error'   => '已经存在类似信息的客户信息'
            ], 422);
        }

        $customer = Customer::create($request->all());

        activity(ActivityLog::TYPE_CUSTOMER_ADD)
            ->performedOn($customer)
            ->withProperties([
                'ip'    => $request->ip(),
                'agent' => $request->userAgent(),
            ])
            ->log("添加顾客 {$request->name} 信息");

        return response()->json([
            'message' => '添加成功'
        ], 422);
    }

    /**
     * 修改顾客信息
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id) {
        $validator = Validator::make($request->all(), [
            'name'     => 'required',
            'email'    => [
                'required',
                'email'
            ],
            'phone'    => ['max:32'],
            'country'  => ['max:32'],
            'province' => ['max:32'],
            'city'     => ['max:32'],
            'address1' => ['max:128'],
            'address2' => ['max:128'],
            'address3' => ['max:128'],
            'zip_code' => ['max:16']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '添加失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $customer = Customer::find($id);

        if (empty($customer)) {
            return response()->json([
                'message' => '修改失败',
                'error'   => '为找到该ID的顾客信息'
            ], 422);
        }

        $customer->update($request->all());

        activity(ActivityLog::TYPE_CUSTOMER_UPDATE)
            ->performedOn($customer)
            ->withProperties([
                'ip'    => $request->ip(),
                'agent' => $request->userAgent(),
            ])
            ->log("修改 {$request->name} 的顾客信息");

        return response()->json([
            'message' => '修改成功',
        ], 200);
    }

    /**
     * 删除顾客信息
     * @param Request $request
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id) {
        return response()->json([
            'message'   => '还未开放此接口'
        ], 422);

        $customer = Customer::find($id);

        if (empty($customer)) {
            return response()->json([
                'message' => '删除失败',
                'error'   => '未发现该ID的顾客信息'
            ], 422);
        }


        activity(ActivityLog::TYPE_CUSTOMER_DELETE)
            ->withProperties([
                'ip'       => $request->ip(),
                'agent'    => $request->userAgent(),
                'customer' => $customer
            ])
            ->log("删除 {$customer->name} 的顾客信息");

        $customer->delete();

        return response()->json([
            'message' => '删除成功'
        ], 422);
    }
}
