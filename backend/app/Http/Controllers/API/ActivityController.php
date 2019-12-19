<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Spatie\QueryBuilder\QueryBuilder;

class ActivityController extends Controller
{
    public function baseSearch(Request $request) {
        return QueryBuilder::for(ActivityLog::query())
            ->defaultSort('-created_at');
    }

    //
    public function index(Request $request) {
        $pageSize = $request->input('page_size', 10);

        $query = $this->baseSearch($request)
            ->with(['causer', 'subject'])
            ->paginate($pageSize);

        return $query;
    }
}
