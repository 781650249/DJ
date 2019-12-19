<?php
namespace App\Util;

use Chumper\Zipper\Zipper;
use Illuminate\Support\Facades\Storage;

class Util {

    /**
     * 解压文件
     * 返回数据
     * {
     *   success: 'true',
     *   message: 'success',
     *   files: [
     *      {
     *          name: 'test.jpg',
     *          path: 'storage/.../test.jpg',
     *          mime_type: 'image/jpeg',
     *          type: 'jpg',
     *          size: '236000'
     *      }
     *   ]
     * }
     * @param string $path 文件路径
     * @param string $dirPatch 解压路径
     * @return array
     */
    public static function unzip($path, $dirPath) {
        if (!Storage::disk('public')->exists($path)) {
            return [
                'success' => false,
                'message' => '文件不存在'
            ];
        }

        $zip = new Zipper();

        // 真实路径
        $realPath = Storage::disk('public')->path($path);

        try {
            $zip->make($realPath)->extractTo("storage/$dirPath");
        }

        catch (\Exception $exception) {
            return [
                'success'  => false,
                'messaghe' => $exception->getMessage()
            ];
        }

        $fileList = Storage::disk('public')->files($dirPath);

        if (count($fileList) === 0) {
            return [
                'success' => false,
                'message' => '解压后，该文件下并没有任何文件'
            ];
        }

        $response = [];

        foreach ($fileList as $item) {
            $fileInfo = self::getFileInfo($item);

            // 文件不存在的跳过
            if (!$fileInfo) {
                continue;
            }

            // 如果是文件夹的跳过
            if ($fileInfo['type'] !== 'file')
            {
                continue;
            }

            $response[] = $fileInfo;
        }

        if (count($response) === 0) {
            return [
                'success'   => false,
                'message'   => '该压缩文件下，没有直接文件；暂时不支持读取压缩问价里的目录文件'
            ];
        }

        return [
            'success' => true,
            'message' => '解压成功',
            'files'   => $response
        ];
    }

    /**
     * 获取文件信息
     * @param $path
     * @return array
     */
    public static function getFileInfo($path) {
        $filePath = Storage::disk('public')->path($path);

        try {
            $mimeType = mime_content_type($filePath);
            $fileType = filetype($filePath);
            $fileSize = filesize($filePath);
            $pathInfo = pathinfo($filePath);
            $isReadAble = is_readable($filePath);
            $isWriteAble = is_writeable($filePath);
        } catch (\Exception $exception) {
            return null;
        }

        return [
            'path'          => $path,
            'name'          => $pathInfo['basename'] ?? null,
            'extension'     => $pathInfo['extension'] ?? null,
            'filename'      => $pathInfo['filename'] ?? null,
            'mime_type'     => $mimeType,
            'type'          => $fileType,
            'size'          => $fileSize,
            'is_write_able' => $isWriteAble,
            'is_read_able'  => $isReadAble
        ];
    }

    /**
     * excel的时间格式话，excel的开始时间是1900-01-01 00:00:00
     * unix的开始时间是1970-01-01 00:00:00
     * 1、判断传参是否为时间格式
     * 2、数字的话，尝试转换成时间格式
     * 3、gmdata 格式转换成utc时间， date是转换成本地时间
     * @param $data
     * @param string $format
     * @return bool|false|string
     */
    public static function formatExcelDate($data, $format='Y-m-d H:i:s') {
        if (is_string($data)) {
            if (strtotime($data)) {
                return date($format, strtotime($data));
            }
            else {
                return false;
            }
        }

        if (is_numeric($data)) {
            $n = intval(($data - 25569) * 3600 * 24);
            return gmdate($format, $n);
        }

        return false;
    }
}
