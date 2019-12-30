<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index()->comment('客户名称');
            $table->string('email')->index()->nullable()->comment('客户邮箱');
            $table->string('phone')->index()->nullable()->comment('客户电话');
            $table->string('country')->index()->nullable()->comment('国家（简码）');
            $table->string('province')->nullable()->comment('省份');
            $table->string('city')->nullable()->comment('城市');
            $table->string('address1')->nullable()->comment('地址1');
            $table->string('address2')->nullable()->comment('地址2');
            $table->string('address3')->nullable()->comment('地址3');
            $table->string('zip_code')->nullable()->comment('邮编');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
