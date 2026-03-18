<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

use App\Models\RecyclingCenter;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $center = RecyclingCenter::first();

        // Define some core roles to ensure we always have at least one of each with specific emails
        $seedUsers = [
            ['email' => 'resident@ecotrack.com', 'name' => 'Default Resident', 'role' => 'resident'],
            ['email' => 'collector@ecotrack.com', 'name' => 'Default Collector', 'role' => 'collector'],
            ['email' => 'recycler@ecotrack.com', 'name' => 'Default Recycler', 'role' => 'recycler', 'recycling_center_id' => $center?->id],
        ];

        foreach ($seedUsers as $u) {
            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => bcrypt('password'),
                    'role' => $u['role'],
                    'email_verified_at' => now(),
                    'recycling_center_id' => $u['recycling_center_id'] ?? null,
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
            $centers = RecyclingCenter::all();
            User::factory()->count(10)->recycler()->create()->each(function ($user) use ($centers) {
                if ($centers->count() > 0) {
                    $user->update(['recycling_center_id' => $centers->random()->id]);
                }
            });
        }
    }
}
