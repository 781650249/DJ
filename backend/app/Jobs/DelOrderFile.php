<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DelOrderFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $oid;
    private $id;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($oid)
    {
        //
        $this->oid = $oid;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // 删除文件夹
        try {
            Storage::disk('public')->deleteDirectory("file/{$this->oid}");
        } catch (\Exception $exception) {
            Log::error($exception->getMessage());
        }
    }
}
