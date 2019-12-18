<?php

namespace App\Jobs;

use App\ActivityLog;
use App\File;
use App\Order;
use App\Util\Util;
use GuzzleHttp\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Storage;

class DownloadZipFileJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $order;

    /**
     * Create a new job instance.
     * @param Order $order 订单
     * @return void
     */
    public function __construct($order)
    {
        //
        $this->order = $order;
    }

    /**
     * Execute the job.
     *
     * @return array
     */
    public function handle()
    {
        //
        $order = $this->order;

        if ($order->file_url) {
            $this->download($order);
        }
    }

    /**
     * 下载文件
     * @param Order $order
     * @return array
     */
    private function download($order) {
        $url = $order->file_url;

        $client = new Client();

        try {
            $res = $client->request('GET', $url, [
                'Accept'      => 'application/json',
                'timeout'     => 60,
                'http_errors' => false
            ]);
        }
        catch (\Exception $exception) {
            activity(ActivityLog::TYPE_DOWNLOAD_ZIP_FAILED)
                ->performedOn($order)
                ->withProperties([
                    'code'  => $exception->getCode(),
                    'message'   => $exception->getMessage()
                ])
                ->log('下载zip文件时错误异常');

            return null;
        }

        $statusCode = $res->getStatusCode();

        if ($statusCode === 200) {
            // 文件类型
            $contType = $res->getHeaders()['Content-Type'][0] ?? null;

            if ($contType && $contType == 'application/zip') {
                $file = $res->getBody();

                $orderName = $order->number;

                // 将.换成下划线
                $orderName = str_replace('.', '_', $orderName);

                $fileName = "file/{$orderName}/origin/origin_file.zip";

                // 保存
                Storage::disk('public')->put($fileName, $file);

                $fileInfo = Util::getFileInfo($fileName);

                if ($fileInfo) {
                    $order->files()
                        ->updateOrCreate(
                            [
                                'type' => File::TYPE_ORIGINAL_ZIP
                            ], [
                                'name'      => $fileInfo['name'],
                                'path'      => $fileInfo['path'],
                                'mime_type' => $fileInfo['mime_type'],
                                'extension' => $fileInfo['extension'],
                                'size'      => $fileInfo['size'],
                            ]
                        );

                    activity(ActivityLog::TYPE_DOWNLOAD_ZIP)
                        ->performedOn($order)
                        ->withProperties($fileInfo)
                        ->log('下载原始素材成功');

                    $unZipRes = Util::unzip($fileName, "file/$orderName/unzip/");

                    if ($unZipRes['success']) {
                        $fileLists = $unZipRes['files'];

                        activity(ActivityLog::TYPE_UNZIP_FILE)
                            ->performedOn($order)
                            ->withProperties($fileLists)
                            ->log('解压文件成功');

                        foreach ($fileLists as $item) {
                            $order->files()
                                ->updateOrCreate(
                                    [
                                        'type' => File::TYPE_UNZIP_FILE,
                                        'name' => $item['name']
                                    ], [
                                        'path'      => $item['path'],
                                        'mime_type' => $item['mime_type'],
                                        'extension' => $item['extension'],
                                        'size'      => $item['size'],
                                    ]
                                );
                        }
                    }

                    else {
                        activity(ActivityLog::TYPE_UNZIP_FILE_FAILED)
                            ->performedOn($order)
                            ->withProperties([
                                'message' => $unZipRes['message']
                            ])
                            ->log('解压文件失败');
                    }
                }

                else {
                    activity(ActivityLog::TYPE_DOWNLOAD_ZIP_FAILED)
                        ->withProperties($order)
                        ->withProperties([
                            'zip_path' => $fileName
                        ])
                        ->log('获取已下载原始zip文件信息时出现错误');
                }

            }

            else {
                activity(ActivityLog::TYPE_DOWNLOAD_ZIP_FAILED)
                    ->performedOn($order)
                    ->withProperties([
                        'mime_type' => $contType,
                    ])
                    ->log('下载的文件不是zip文件');
            }
        }
        else {
            activity(ActivityLog::TYPE_DOWNLOAD_ZIP_FAILED)
                ->performedOn($order)
                ->withProperties([
                    'status_code' => $statusCode,
                    'content'     => $res->getBody()->getContents()
                ])
                ->log('下载的文件失败');
        }
    }
}
