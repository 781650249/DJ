<?php

use Illuminate\Http\Request;
use \Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
$api = new Route();

// 无登陆验证路由
Route::group(['namespace'   => 'API'], function ($api) {
    // 登录
    $api->post('/oauth/token', '\Laravel\Passport\Http\Controllers\AccessTokenController@issueToken')
        ->name('passport.token');

    // 注册
    $api->post('/user/register', 'UserController@store');
});

// 登陆验证路由
Route::group(['middleware' => 'auth:api', 'namespace'  => 'API'], function ($api) {
    /****************** 用户 ******************************************/

    $api->get('/me', 'UserController@getMe');

    // 修改密码
    $api->put('/me/password', 'UserController@changePassword');

    /****************** 商品 ******************************************/
    $api->resource('/products', 'ProductController');

});
