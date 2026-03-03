<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WasteCategory extends Model
{
    /** @use HasFactory<\Database\Factories\WasteCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon_url',
        'points_per_kg',
    ];

    public function pickups()
    {
        return $this->hasMany(WastePickup::class, 'category_id');
    }
}
