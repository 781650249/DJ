<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->boolean('double_side')->default(false)->comment('单双面');
            $table->float('purchase_price')->nullable()->comment('采购价格');
            $table->float('weight')->nullable()->comment('重量');
            $table->string('title')->nullable()->comment('标题');
            $table->string('sku')->index()->comment('sku');
            $table->string('title_en')->nullable()->comment('英文标题');
            $table->text('note')->nullable()->comment('备注');
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
        Schema::dropIfExists('products');
    }
}
