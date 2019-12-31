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

    // 下载导出的订单excel
    $api->get('/orders/download_excel/{token}', 'OrderController@downloadExcel');
});

// 登陆验证路由
Route::group(['middleware' => 'auth:api', 'namespace'  => 'API'], function ($api) {
    /****************** 用户 ******************************************/
    $api->get('/me', 'UserController@getMe');

    // 修改密码
    $api->put('/me/password', 'UserController@changePassword');

    /****************** 商品 ******************************************/
    $api->post('/products/import', 'ProductController@import');

    // 批量删除
    $api->post('/products/batch_delete', 'ProductController@batchDel');

    $api->resource('/products', 'ProductController');

    /***************** 订单 ******************************************/
    $api->post('/orders/import', 'OrderController@import');

    // 更新状态
    $api->put('/order/status/{id}', 'OrderController@updateStatus');

    // 标记为加急
    $api->put('/order/urgent/{id}', 'OrderController@markUrgent');

    $api->post('/orders/batch_urgent', 'OrderController@batchMarkUrgent');

    $api->put('/order/cancel_urgent/{id}', 'OrderController@cancelMarkUrgent');

    // 批量取消加急
    $api->post('/order/batch_cancel_urgent', 'OrderController@batchCancelUrgent');

    // 导出订单
    $api->get('/orders/export', 'OrderController@export');

    $api->resource('/orders', 'OrderController');

    /***************** 顾客 ******************************************/
    $api->resource('/customer', 'CustomerController');

    /**************** 订单物流 ***************************************/
    // 导入物流订单
    $api->post('/shipping/import', 'ShippingController@import');

    // 资源api
    $api->resource('/shipping', 'ShippingController');

    /***************** 日志 *******************************************/
    $api->get('/activity_log/{log_type}', 'ActivityController@index');
});

