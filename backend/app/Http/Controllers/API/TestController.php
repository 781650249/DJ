<?php

namespace App\Http\Controllers\API;

use App\Imports\ImportToArray;
use App\Products;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class TestController extends Controller
{
    //
    public function upload(Request $request) {
        $file = $request->file('files');

        return response()->json([
            'file_name' => $file->getClientOriginalName(),
            'file_type' => $file->getMimeType(),
            'file_size' => $file->getSize()
        ], 200);
    }
}
