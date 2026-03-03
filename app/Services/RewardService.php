<?php

namespace App\Services;

use App\Models\Reward;
use App\Models\WastePickup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RewardService
{
    /**
     * Award points to a resident for a completed waste pickup.
     *
     * @param WastePickup $pickup
     * @return Reward|null
     */
    public function awardPoints(WastePickup $pickup): ?Reward
    {
        if ($pickup->status !== 'completed' || $pickup->points_awarded > 0) {
            return null;
        }

        try {
            return DB::transaction(function () use ($pickup) {
                $category = $pickup->category;
                $weight = $pickup->weight_kg ?? 0;
                
                // Calculate points: weight * points_per_kg
                $points = $weight * ($category->points_per_kg ?? 1.00);

                if ($points <= 0) {
                    return null;
                }

                // Create reward transaction
                $reward = Reward::create([
                    'user_id' => $pickup->resident_id,
                    'points' => $points,
                    'transaction_type' => 'earned',
                    'description' => "Earned {$points} tokens for {$weight}kg of {$category->name} recycling.",
                ]);

                // Update pickup record with points awarded
                $pickup->update([
                    'points_awarded' => $points,
                ]);

                Log::info("Awarded {$points} points to user #{$pickup->resident_id} for pickup #{$pickup->id}");

                return $reward;
            });
        } catch (\Exception $e) {
            Log::error("Failed to award points for pickup #{$pickup->id}: " . $e->getMessage());
            return null;
        }
    }
}
