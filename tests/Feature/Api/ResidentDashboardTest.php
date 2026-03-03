<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\WasteCategory;
use App\Models\WastePickup;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ResidentDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected $resident;

    protected function setUp(): void
    {
        parent::setUp();
        $this->resident = User::factory()->create(['role' => 'resident']);
        
        WasteCategory::create([
            'name' => 'Plastic',
            'slug' => 'plastic',
            'points_per_kg' => 10
        ]);
    }

    public function test_resident_can_fetch_reward_balance()
    {
        $response = $this->actingAs($this->resident)
            ->getJson('/api/rewards/balance');

        $response->assertStatus(200)
            ->assertJsonStructure(['balance', 'transactions']);
    }

    public function test_resident_can_fetch_pickup_history()
    {
        $category = WasteCategory::first();
        WastePickup::factory()->count(3)->create([
            'resident_id' => $this->resident->id,
            'category_id' => $category->id
        ]);

        $response = $this->actingAs($this->resident)
            ->getJson('/api/waste-pickups');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_resident_can_fetch_waste_categories()
    {
        $response = $this->actingAs($this->resident)
            ->getJson('/api/waste-categories');

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Plastic']);
    }

    public function test_resident_can_schedule_pickup()
    {
        $category = WasteCategory::first();
        
        $data = [
            'category_id' => $category->id,
            'scheduled_at' => now()->addDays(2)->toDateTimeString(),
            'weight_kg' => 5.5
        ];

        $response = $this->actingAs($this->resident)
            ->postJson('/api/waste-pickups', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('waste_pickups', [
            'resident_id' => $this->resident->id,
            'category_id' => $category->id,
            'weight_kg' => 5.5
        ]);
    }
}
