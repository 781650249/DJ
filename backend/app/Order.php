<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\QueryException;

class Order extends Model
{
    const STATUS_UN_DOWNLOAD = 'un_download';
    const STATUS_DOWNLOADED = 'downloaded';
    const STATUS_PROCESSING = 'processing';
    const STATUS_PROCESSED = 'processed';
    const STATUS_PUBLISHED = 'published';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_PRODUCED = 'produced';
    const STATUS_FROZEN = 'frozen';
    const STATUS_WAIT_CHANGE = 'wait_change';

    const ORDER_STATUS = [
        self::STATUS_UN_DOWNLOAD => '未下载',
        self::STATUS_DOWNLOADED  => '已下载',
        self::STATUS_PROCESSING  => '处理中',
        self::STATUS_PROCESSED   => '处理完成',
        self::STATUS_PUBLISHED   => '已发稿',
        self::STATUS_CONFIRMED   => '已确认',
        self::STATUS_PRODUCED    => '已生产',
        self::STATUS_FROZEN      => '冻结',
        self::STATUS_WAIT_CHANGE => '待修改'
    ];

    protected $appends = [
        'order_status'
    ];

    //
    protected $fillable = [
        'oid',
        'number',
        'file_url',
        'status',
        'note',
        'published_at',
        'produced_at',
        'sku',
        'quantity',
        'customer_id',
        'created_at'
    ];

    public function customer() {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function product() {
        return $this->belongsTo(Products::class, 'sku', 'sku');
    }

    public function files() {
        return $this->hasMany(File::class, 'order_id');
    }

    public function zipFile() {
        return $this->hasOne(File::class, 'order_id')
            ->where('type', File::TYPE_ORIGINAL_ZIP);
    }

    public function unZipFiles() {
        return $this->hasMany(File::class,'order_id')
            ->where('type', File::TYPE_UNZIP_FILE);
    }

    public function finishFiles() {
        return $this->hasMany(File::class, 'order_id')
            ->where('type', File::TYPE_FINISH_FILE);
    }

    /**
     * 邮箱搜索
     * @param Builder $query
     * @param $val
     */
    public function scopeEmail($query, $val) {
        return $query->whereHas('customer', function ($q) use ($val) {
            $q->where('email', 'like', "%{$val}%");
        });
    }

    /**
     * 关键字搜索
     * @param $query
     * @param $val
     * @return mixed
     */
    public function scopeKeyword($query, $val) {
        return $query->where('oid', 'like', "%{$val}%")
            ->orWhere('number', 'like', "%{$val}%");
    }

    /**
     * 客户名称搜索
     * @param Builder $query
     * @param $val
     */
    public function scopeName($query, $val) {
        return $query->whereHas('customer', function ($q) use ($val) {
            $q->where('name', 'like', "%{$val}%");
        });
    }

    public function getOrderStatusAttribute() {
        if ($this->status) {
            return self::ORDER_STATUS[$this->status];
        }
    }
}
