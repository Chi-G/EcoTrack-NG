<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WastePickup>
 */
class WastePickupFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'status' => 'pending',
            'scheduled_at' => $this->faker->dateTimeBetween('now', '+1 month'),
            'weight_kg' => $this->faker->randomFloat(2, 0.5, 50),
        ];
    }
}
