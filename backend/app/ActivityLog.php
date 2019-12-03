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
}
