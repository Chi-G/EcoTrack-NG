<?php

use App\Events\CollectorLocationUpdated;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('collector can update their live location', function () {
    Event::fake();

    $collector = User::factory()->create(['role' => 'collector']);

    $coords = ['lat' => 6.5244, 'lng' => 3.3792]; // Lagos

    $response = $this->actingAs($collector, 'sanctum')
        ->postJson('/api/location/update', $coords);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    // Verify Event Broadcast
    Event::assertDispatched(CollectorLocationUpdated::class, function ($event) use ($collector, $coords) {
        return $event->collectorId === $collector->id &&
               $event->lat == $coords['lat'] &&
               $event->lng == $coords['lng'];
    });
});

test('resident cannot update location', function () {
    $resident = User::factory()->create(['role' => 'resident']);

    $response = $this->actingAs($resident, 'sanctum')
        ->postJson('/api/location/update', ['lat' => 1, 'lng' => 1]);

    $response->assertStatus(403);
});
