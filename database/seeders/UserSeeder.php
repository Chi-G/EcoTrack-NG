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
        // Define some core roles to ensure we always have at least one of each with specific emails
        $seedUsers = [
            ['email' => 'resident@ecotrack.com', 'name' => 'Default Resident', 'role' => 'resident'],
            ['email' => 'collector@ecotrack.com', 'name' => 'Default Collector', 'role' => 'collector'],
            ['email' => 'recycler@ecotrack.com', 'name' => 'Default Recycler', 'role' => 'recycler'],
        ];

        foreach ($seedUsers as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => bcrypt('password'),
                    'role' => $u['role'],
                    'email_verified_at' => now(),
                ]
            );
        }

        // Only add more if count is low
        if (User::where('role', 'resident')->count() < 10) {
            User::factory()->count(10)->resident()->create();
        }

        if (User::where('role', 'collector')->count() < 10) {
            User::factory()->count(10)->collector()->create();
        }

        if (User::where('role', 'recycler')->count() < 10) {
            User::factory()->count(10)->recycler()->create();
        }
    }
}
