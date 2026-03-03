<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\WasteCategory;
use App\Models\WastePickup;
use App\Services\RewardService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RewardServiceTest extends TestCase
{
    use RefreshDatabase;

    protected RewardService $rewardService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->rewardService = new RewardService();
    }

    public function test_it_calculates_and_awards_points_correctly()
    {
        $resident = User::factory()->create(['role' => 'resident']);
        $category = WasteCategory::create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'points_per_kg' => 10
        ]);

        $pickup = WastePickup::create([
            'resident_id' => $resident->id,
            'category_id' => $category->id,
            'scheduled_at' => now(),
            'status' => 'completed',
            'weight_kg' => 2.5
        ]);

        $reward = $this->rewardService->awardPoints($pickup);

        $this->assertNotNull($reward);
        $this->assertEquals(25.0, $reward->points);
        $this->assertEquals('earned', $reward->transaction_type);
        $this->assertEquals(25.0, $pickup->refresh()->points_awarded);
    }

    public function test_it_does_not_award_points_if_pickup_is_not_completed()
    {
        $resident = User::factory()->create(['role' => 'resident']);
        $category = WasteCategory::create([
            'name' => 'Metal',
            'slug' => 'metal',
            'points_per_kg' => 5
        ]);

        $pickup = WastePickup::create([
            'resident_id' => $resident->id,
            'category_id' => $category->id,
            'scheduled_at' => now(),
            'status' => 'assigned',
            'weight_kg' => 2.5
        ]);

        $reward = $this->rewardService->awardPoints($pickup);

        $this->assertNull($reward);
        $this->assertEquals(0, $pickup->refresh()->points_awarded);
    }
}
