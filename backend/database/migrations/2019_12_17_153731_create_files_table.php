<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name')->index()->comment('文件名称');
            $table->string('type')->index()->comment('素材类型');
            $table->string('path')->unique()->comment('文件路径');
            $table->string('mime_type')->comment('文件类型');
            $table->string('extension')->comment('文件后缀');
            $table->bigInteger('size')->default(0)->comment('素材大小');
            $table->bigInteger('order_id')->unsigned()->comment('外键');
            $table->text('note')->nullable()->comment('备注');

            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('Cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('files');
    }
}
