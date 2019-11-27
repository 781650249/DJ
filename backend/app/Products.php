<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use MongoDB\Driver\Query;

class Products extends Model
{
    //
    protected $fillable = [
        'double_side',
        'purchase_price',
        'title',
        'title_en',
        'weight',
        'created_at',
        'updated_at',
        'sku',
        'note',
    ];

    protected $hidden = [
        'updated_at'
    ];

    /**
     * 关键字搜索
     * @param Builder $query
     * @param $value
     * @return mixed
     */
    public function scopeKeyword($query, $value) {
        return $query->where('title', 'like', "%$value%")
            ->orWhere('title_en', 'like', "%$value%")
            ->orWhere('sku', 'like', "%$value%");
    }

    /**
     * 重量范围
     * @param Builder $query
     * @param $val1
     * @param $val2
     * @return mixed
     */
    public function scopeWeight($query, $val1, $val2) {
        return $query->whereBetween('weight', [$val1, $val2]);
    }

    /**
     * 采购价格范围
     * @param Builder $query
     * @param $val1
     * @param $val2
     * @return mixed
     */
    public function scopePurchasePrice($query, $val1, $val2) {
        return $query->whereBetween('purchase_price', [$val1, $val2]);
    }
}
