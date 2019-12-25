<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    protected $table = 'activity_log';

    protected $casts = [
        'properties'    => 'json'
    ];

    //
    const TYPE_AUTH_TYPE_CHANGE_PASSWORD = 'CHANGE_PASSWORD';   // 修改密码

    /************ 商品管理 ***************/
    const TYPE_PRODUCT_ADD = 'PRODUCT_ADD';       // 添加商品
    const TYPE_PRODUCT_UPDATE = 'PRODUCT_UPDATE'; // 更新商品
    const TYPE_PRODUCT_DELETE = 'PRODUCT_DELETE'; // 删除商品
    const TYPE_PRODUCT_IMPORT = 'PRODUCT_IMPORT'; // 批量导入
    const TYPE_PRODUCT_IMPORT_FAILED = 'PRODUCT_IMPORT_FAILED'; // 批量导入失败
    const TYPE_PRODUCT_IMPORT_ADD = 'PRODUCT_IMPORT_ADD'; // 导入添加
    const TYPE_PRODUCT_IMPORT_UPDATE = 'PRODUCT_IMPORT_UPDATE'; // 导入更新
    const TYPE_PRODUCT_BATCH_DELETE = 'PRODUCT_BATCH_DELETE'; // 批量删除中删除商品
    const TYPE_PRODUCTS_BATCH_DEL = 'PRODUCTS_BATCH_DEL'; // 商品批量删除

    /************* 订单管理 *****************/
    const TYPE_ORDER_ADD = 'ORDER_ADD'; // 添加订单
    const TYPE_IMPORT_ORDER = 'IMPORT_ORDER'; // 导入订单
    const TYPE_IMPORT_ORDER_FAILED = 'IMPORT_ORDER_FAILED';
    const TYPE_IMPORT_ORDER_CREATE = 'IMPORT_ORDER_CREATE';
    const TYPE_IMPORT_ORDER_UPDATE = 'IMPORT_ORDER_UPDATE';

    const TYPE_ORDER_UPDATE_STATUS = 'ORDER_UPDATE_STATUS';
    const TYPE_ORDER_MARK_URGENT = 'ORDER_MARK_URGENT'; // 标记为加急
    const TYPE_ORDER_BATCH_MARK_URGENT = 'ORDER_BATCH_MARK_URGENT'; // 批量标记加急
    const TYPE_ORDER_BATCH_MARK_URGENT_FAILED = 'ORDER_BATCH_MARK_URGENT_FAILED'; // 批量标记失败
    const TYPE_ORDER_CANCEL_URGENT = 'ORDER_CANCEL_URGENT'; // 取消加急
    const TYPE_ORDER_BATCH_CANCEL_URGENT = 'ORDER_BATCH_CANCEL_URGENT'; // 批量取消加急

    /************* customer ****************/
    const TYPE_CUSTOMER_ADD = 'CUSTOMER_ADD';
    const TYPE_CUSTOMER_UPDATE = 'CUSTOMER_UPDATE';
    const TYPE_CUSTOMER_DELETE = 'CUSTOMER_DELETE';
    const TYPE_IMPORT_ORDER_CREATE_CUSTOMER = 'IMPORT_ORDER_CREATE_CUSTOMER';
    const TYPE_IMPORT_ORDER_UPDATE_CUSTOMER = 'IMPORT_ORDER_UPDATE_CUSTOMER';

    /************* file ********************/
    const TYPE_DOWNLOAD_ZIP = 'DOWNLOAD_ZIP'; // 下载原始zip文件
    const TYPE_DOWNLOAD_ZIP_FAILED = 'DOWNLOAD_ZIP_FAILED'; // 下载zip文件失败
    const TYPE_UNZIP_FILE = 'UNZIP_FILE'; // 解压zip文件
    const TYPE_UNZIP_FILE_FAILED = 'UNZIP_FILE_FAILED'; // 解压zip文件失败

    /************ shipping ****************/
    const TYPE_SHIPPING_IMPORT = 'SHIPPING_IMPORT';
    const TYPE_SHIPPING_IMPORT_ADD = 'SHIPPING_IMPORT_ADD';
    const TYPE_SHIPPING_IMPORT_UPDATE = 'SHIPPING_IMPORT_UPDATE';
    const TYPE_SHIPPING_IMPORT_FAILED = 'SHIPPING_IMPORT_FAILED';

    public function causer(): MorphTo {
        return $this->morphTo('causer', 'causer_type', 'causer_id');
    }

    public function subject(): MorphTo {
        return $this->morphTo('subject', 'subjetc_type', 'subject_id');
    }

}
