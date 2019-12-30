<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    const TYPE_ORIGINAL_ZIP = 'ORIGINAL_ZIP';
    const TYPE_UNZIP_FILE = 'UNZIP_FILE'; // 解压后文件
    const TYPE_FINISH_FILE = 'FINISH_FILE'; // 已完成文件

    //
    protected $fillable = [
        'name',
        'type',
        'path',
        'mime_type',
        'size',
        'order_id',
        'note',
        'extension'
    ];

    protected $appends = [
        'file_path'
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    public function getFilePathAttribute() {
        if ($this->path) {
            return Storage::disk('public')->url($this->path);
        }
    }
}
