<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecyclingCenter extends Model
{
    /** @use HasFactory<\Database\Factories\RecyclingCenterFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'location',
        'contact_number',
        'operating_hours',
    ];

    public function sensors()
    {
        return $this->hasMany(IoTSensor::class);
    }

    public function collectors()
    {
        return $this->hasMany(User::class, 'recycling_center_id')->where('role', 'collector');
    }

    public function recyclers()
    {
        return $this->hasMany(User::class, 'recycling_center_id')->where('role', 'recycler');
    }

    public function pickups()
    {
        return $this->hasMany(WastePickup::class, 'recycling_center_id');
    }
}
