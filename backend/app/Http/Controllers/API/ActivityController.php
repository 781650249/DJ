<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
            default: $query = $this->baseSearch($request);
        }

        $pageSize = $request->input('page_size', 10);

        $log = $query->with(['causer', 'subject'])
            ->paginate($pageSize);

        return $log;
    }
}
