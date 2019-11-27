<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    //
    const TYPE_AUTH_TYPE_CHANGE_PASSWORD = 'CHANGE_PASSWORD';   // 修改密码
}
