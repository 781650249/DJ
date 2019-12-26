<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\QueryException;

class OrderShipping extends Model {
    //
    protected $fillable = [
        'track_number',
        'order_number',
        'shipping_date',
        'note'
    ];

    public function order() {
        return $this->belongsTo(Order::class, 'order_number', 'number');
    }

    /**
     *
     * @param $query
     * @param array ...$val
     * @return mixed
     */
    public function scopeCreatedAt($query, ...$val) {
        return $query->whereBetween('created_at', $val);
    }

    /**
     * @param Builder $query
     * @param $val
     * @return mixed
     */
    public function scopeHasOrder($query, $val) {
        if ($val) {
            return $query->has('order');
        } else {
            return $query->doesntHave('order');
        }
    }
}
