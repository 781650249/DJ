<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ActivityController extends Controller
{
    public function baseSearch(Request $request) {
        return QueryBuilder::for(ActivityLog::query())
            ->defaultSort('-created_at');
    }

    /**
     * 导入订单日志
     * @param Request $request
     * @return QueryBuilder|self
     */
    public function importShippingLog(Request $request) {
        $logTypeArr = [ActivityLog::TYPE_SHIPPING_IMPORT];

        return QueryBuilder::for(ActivityLog::whereIn('log_name', $logTypeArr))
            ->allowedSorts('created_at')
            ->defaultSort('-created_at');
    }

    public function orderOperateLog(Request $request) {
        $logTypeArr = [
            ActivityLog::TYPE_ORDER_UPDATE_STATUS,
            ActivityLog::TYPE_ORDER_MARK_URGENT,
            ActivityLog::TYPE_ORDER_BATCH_MARK_URGENT,
            ActivityLog::TYPE_ORDER_BATCH_MARK_URGENT_FAILED,
            ActivityLog::TYPE_ORDER_CANCEL_URGENT,
            ActivityLog::TYPE_ORDER_BATCH_CANCEL_URGENT
        ];

        return QueryBuilder::for(ActivityLog::whereIn('log_name', $logTypeArr))
            ->allowedSorts('created_at')
            ->allowedFilters(
                AllowedFilter::scope('oid'),
                AllowedFilter::scope('user_name')
            )
            ->defaultSort('-created_at');
    }

    //
    public function index(Request $request, $logType) {
        if (!$logType) {
            return response()->json([
                'message'   => '获取日志失败',
                'error'     => '未指明日志类型，请加上log_type参数'
            ],500);
        }

        switch ($logType) {
            case 'shipping_import':
                $query = $this->importShippingLog($request);
                break;
            case 'order_operate':
                $query = $this->orderOperateLog($request);
                break;
            default: $query = $this->baseSearch($request);
        }

        $pageSize = $request->input('page_size', 10);

        $log = $query->with(['causer', 'subject'])
            ->paginate($pageSize);

        return $log;
    }
}
