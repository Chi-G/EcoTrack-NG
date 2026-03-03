<?php

namespace Database\Seeders;

use App\Models\WasteCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class WasteCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Plastic',
                'description' => 'PET bottles, containers, and other plastic materials.',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/2666/2666683.png',
                'points_per_kg' => 50,
            ],
            [
                'name' => 'Paper',
                'description' => 'Cardboard, newspapers, and office paper.',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/2541/2541991.png',
                'points_per_kg' => 30,
            ],
            [
                'name' => 'Glass',
                'description' => 'Bottles, jars, and other glassware.',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/3050/3050204.png',
                'points_per_kg' => 40,
            ],
            [
                'name' => 'Metal',
                'description' => 'Aluminum cans, steel, and scrap metal.',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/1043/1043324.png',
                'points_per_kg' => 80,
            ],
            [
                'name' => 'Organic',
                'description' => 'Food waste and biodegradable materials.',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/2666/2666505.png',
                'points_per_kg' => 20,
            ],
            [
                'name' => 'E-Waste',
                'description' => 'Old electronics, batteries, and appliances.',
                'icon_url' => 'https://cdn-icons-png.flaticon.com/512/3252/3252912.png',
                'points_per_kg' => 150,
            ],
        ];

        foreach ($categories as $category) {
            WasteCategory::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                $category
            );
        }
    }
}
