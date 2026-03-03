<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reward extends Model
{
    /** @use HasFactory<\Database\Factories\RewardFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'points',
        'transaction_type',
        'description',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
