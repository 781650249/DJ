<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToArray;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Events\BeforeSheet;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

HeadingRowFormatter::default('none');

/**
 * 导入Excel转Array
 * Class ImportToArray
 * @package App\Imports
 */
class ImportToArray implements ToArray, WithEvents, WithHeadingRow
{
    private $sheetNames;
    private $sheetData;

    public function __construct() {
        $this->sheetData = [];
        $this->sheetNames = [];
    }

    public function array(array $array)
    {
        if(count($this->sheetNames) > 0)
        {
             $this->sheetData[$this->sheetNames[count($this->sheetNames)-1]] = $array;
        }
    }

    public function registerEvents(): array
    {
        return [
            BeforeSheet::class => function(BeforeSheet $event) {
                $this->sheetNames[] = $event->getSheet()->getTitle() ?? null;
            }
        ];
    }

    public function toArray() {
        return $this->sheetData;
    }

    public function getSheetNames() {
        return $this->sheetNames;
    }
}
