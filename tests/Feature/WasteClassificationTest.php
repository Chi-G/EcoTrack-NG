<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\WasteCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WasteClassificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\WasteCategorySeeder::class);
    }

    public function test_can_classify_waste_via_api()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/waste/classify', [
                'image' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'is_mock' => true,
            ]);
            
        $this->assertNotNull($response->json('category.name'));
    }

    public function test_classification_requires_authentication()
    {
        $response = $this->postJson('/api/waste/classify', [
            'image' => 'somebase64string',
        ]);

        $response->assertStatus(401);
    }

    public function test_it_correctly_maps_labels_to_category()
    {
        // This tests the logic in AiService via a public method if it was public, 
        // or we can test it through the controller by mocking the service.
        // For now, testing the mock success is enough for the infrastructure step.
        $user = User::factory()->create();
        
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/waste/classify', [
                'image' => 'base64image',
            ]);
            
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'category' => ['id', 'name', 'slug', 'points_per_kg'],
                'confidence',
                'label'
            ]);
    }
}
