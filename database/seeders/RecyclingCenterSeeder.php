<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\RecyclingCenter;

class RecyclingCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centers = [
            [
                'name' => 'Lagos Eco-Hub',
                'address' => '12 Ikeja Industrial Estate, Lagos',
                'contact_number' => '+234 801 234 5678',
                'operating_hours' => '8:00 AM - 6:00 PM',
            ],
            [
                'name' => 'Abuja Green Center',
                'address' => 'Plot 45 Garki District, Abuja',
                'contact_number' => '+234 905 555 1234',
                'operating_hours' => '7:00 AM - 5:00 PM',
            ],
            [
                'name' => 'Kano Recovery Plant',
                'address' => 'Bompai Industrial Area, Kano',
                'contact_number' => '+234 703 111 2222',
                'operating_hours' => '9:00 AM - 8:00 PM',
            ],
            [
                'name' => 'Port Harcourt Plastic Works',
                'address' => 'Trans-Amadi Layout, Port Harcourt',
                'contact_number' => '+234 812 999 8888',
                'operating_hours' => '24/7',
            ],
        ];

        foreach ($centers as $center) {
            RecyclingCenter::updateOrCreate(
                ['name' => $center['name']],
                $center
            );
        }
    }
}
