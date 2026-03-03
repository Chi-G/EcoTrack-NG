<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate 20 Residents
        User::factory()->count(20)->resident()->create();

        // Generate 20 Collectors
        User::factory()->count(20)->collector()->create();

        // Generate 20 Recyclers
        User::factory()->count(20)->recycler()->create();
    }
}
