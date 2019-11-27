<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use \Illuminate\Support\Facades\Validator;

class AuthenticateController extends Controller
{
    //
    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|exists:user',
            'password' => 'required|between:5,32',
        ]);

        if ($validator->fails()) {
            return response([
                'errors' => $validator->errors()->toArray(),
                'code' => 401,
            ], 401);
        }
    }
}
