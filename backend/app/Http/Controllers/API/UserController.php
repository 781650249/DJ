<?php

namespace App\Http\Controllers\API;

use App\ActivityLog;
use App\Rules\CheckOldPassword;
use App\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller {
    //
    //
    public function getMe(Request $request) {
        $user = Auth::user();

        return $user;
    }

    /**
     * 注册
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {

        // 验证
        $validator = Validator::make($request->all(), [
            'name'       => [
                'required',
                'max:32'
            ],
            'email'      => [
                'required',
                'email',
                'max:32',
                'unique:users'
            ],
            'password'   => [
                'required',
                'max:32'
            ],
            'c_password' => [
                'required',
                'same:password',
                'max:32'
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '注册失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $user = User::create($input);

        $token = $user->createToken('erp-dj')->accessToken;

        return response()->json([
            'token'   => $token,
            'success' => true,
            'message' => '注册成功'
        ], 200);
    }

    /**
     * 修改密码
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function changePassword (Request $request) {
        $validator = Validator::make($request->all(), [
            'old_password' => [
                'required',
                new CheckOldPassword()
            ],
            'new_password' => 'required|min:6|max:18',
            'confirm_password'     => 'required|same:new_password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => '注册失败',
                'error'   => $validator->errors()->first() ?? '未知错误'
            ], 422);
        }


        $user = Auth::user();
        $user->password = Hash::make($request->newPassword);
        $user->save();

        // 记录到日志
        activity(ActivityLog::TYPE_AUTH_TYPE_CHANGE_PASSWORD)
            ->causedBy($user)
            ->withProperties([
                'ip'    => $request->ip(),
                'agent' => $request->userAgent()
            ])
            ->log('change password');

        return response()->json([
            'success'   => true,
            'message'   => '修改成功'
        ]);
    }
}
