<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WastePickup extends Model
{
    /** @use HasFactory<\Database\Factories\WastePickupFactory> */
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'collector_id',
        'category_id',
        'status',
        'scheduled_at',
        'completed_at',
        'weight_kg',
        'points_awarded',
    ];

    public function resident()
    {
        return $this->belongsTo(User::class, 'resident_id');
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collector_id');
    }

    public function category()
    {
        return $this->belongsTo(WasteCategory::class, 'category_id');
    }
}
