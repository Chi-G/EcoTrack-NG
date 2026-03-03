<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IoTSensor extends Model
{
    /** @use HasFactory<\Database\Factories\IoTSensorFactory> */
    use HasFactory;

    protected $fillable = [
        'recycling_center_id',
        'sensor_type',
        'last_reading',
        'status',
    ];

    public function recyclingCenter()
    {
        return $this->belongsTo(RecyclingCenter::class);
    }
}
