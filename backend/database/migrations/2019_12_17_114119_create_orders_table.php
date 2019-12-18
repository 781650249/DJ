<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index()->comment('订单号');
            $table->string('number')->unique()->comment('订单编号');
            $table->string('file_url')->nullable()->comment('素材文件地址');
            $table->string('status')->comment('状态');
            $table->text('note')->comment('备注');
            $table->dateTime('published_at')->nullable()->comment('发稿时间');
            $table->dateTime('produced_at')->nullable()->comment('生产时间');
            $table->string('sku')->index()->comment('sku码');
            $table->integer('quantity')->default(1)->comment('销售数量');

            $table->bigInteger('customer_id')->nullable()->unsigned();
            $table->timestamps();

            // 顾客外键
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
