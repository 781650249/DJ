<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    //
    protected $fillable = [
        'name',
        'email',
        'phone',
        'country',
        'province',
        'city',
        'address1',
        'address2',
        'address3',
        'zip_code'
    ];

    protected $hidden = [
        'updated_at',
        'created_at'
    ];

    public function orders() {
        return $this->hasMany(Order::class, 'customer_id');
    }
}
