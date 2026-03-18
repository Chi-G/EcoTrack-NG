<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Enums in MySQL are tricky to update via Schema builder without losing data or changing defaults
        // Using a raw statement is safer for adding a value to the list
        DB::statement("ALTER TABLE waste_pickups MODIFY COLUMN status ENUM('pending', 'assigned', 'in_transit', 'completed', 'cancelled', 'delivered') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE waste_pickups MODIFY COLUMN status ENUM('pending', 'assigned', 'in_transit', 'completed', 'cancelled') NOT NULL DEFAULT 'pending'");
    }
};
