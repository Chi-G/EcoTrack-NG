<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\WastePickup;
use App\Models\WasteCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollectorDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_collector_can_access_stats()
    {
        $collector = User::factory()->create(['role' => 'collector']);
        
        $response = $this->actingAs($collector)
            ->getJson('/api/collector/stats');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'today_completed',
                    'today_weight',
                    'active_assigned',
                    'pending_available'
                ]
            ]);
    }

    public function test_resident_cannot_access_collector_stats()
    {
        $resident = User::factory()->create(['role' => 'resident']);
        
        $response = $this->actingAs($resident)
            ->getJson('/api/collector/stats');

        $response->assertStatus(403);
    }

    public function test_collector_can_see_available_and_assigned_pickups()
    {
        $collector = User::factory()->create(['role' => 'collector']);
        $resident = User::factory()->create(['role' => 'resident']);
        $category = WasteCategory::factory()->create();

        // One pending pickup
        WastePickup::create([
            'resident_id' => $resident->id,
            'category_id' => $category->id,
            'status' => 'pending',
            'scheduled_at' => now(),
        ]);

        // One assigned to this collector
        WastePickup::create([
            'resident_id' => $resident->id,
            'collector_id' => $collector->id,
            'category_id' => $category->id,
            'status' => 'assigned',
            'scheduled_at' => now(),
        ]);

        $response = $this->actingAs($collector)
            ->getJson('/api/waste-pickups');

        $response->assertStatus(200);
        // Both should be visible to collector
        $this->assertCount(2, $response->json('data'));
    }

    public function test_collector_can_verify_pickup_with_qr()
    {
        $collector = User::factory()->create(['role' => 'collector']);
        $resident = User::factory()->create(['role' => 'resident']);
        $category = WasteCategory::factory()->create();

        $pickup = WastePickup::create([
            'resident_id' => $resident->id,
            'collector_id' => $collector->id,
            'category_id' => $category->id,
            'status' => 'in_transit',
            'scheduled_at' => now(),
            'verification_token' => 'test-token-123'
        ]);

        $response = $this->actingAs($collector)
            ->patchJson("/api/waste-pickups/{$pickup->id}/verify", [
                'token' => 'test-token-123'
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertEquals('completed', $pickup->fresh()->status);
        $this->assertNotNull($pickup->fresh()->completed_at);
    }
}
