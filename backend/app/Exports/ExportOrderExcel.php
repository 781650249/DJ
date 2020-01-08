<?php

namespace App\Exports;

use App\Order;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;

/**
 * 导入物流信息
 * Class ExportOrderExcel
 * @package App\Exports
 */
class ExportOrderExcel implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithColumnFormatting
{
    private $query;

    public function __construct(Collection $query) {
        $this->query = $query;
    }

    public function headings(): array {
        return [
            '订单号',
            '订单编号',
            '订单状态',
            '物流单号',
            '发稿日期',
            '生产日期',
            'sku',
            '中文名',
            '数量',
            '顾客'
        ];
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return $this->query;
    }

    public function map($query): array {
        return [
            $query->number,
            $query->oid,
            Order::ORDER_STATUS[$query->status] ?? '',
            $query->shipping->track_number ?? '',
            $query->publoshed_at,
            $query->produced_at,
            $query->sku,
            $query->product->title ?? '',
            $query->quantity,
            $query->customer->name ?? '',
        ];
    }

    public function columnFormats(): array {
        return [
            'A' => NumberFormat::FORMAT_NUMBER,
            'B' => NumberFormat::FORMAT_TEXT,
            'D' => NumberFormat::FORMAT_NUMBER,
        ];
    }
}
