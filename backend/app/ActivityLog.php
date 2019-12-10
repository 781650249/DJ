<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
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
}
