<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('waste_pickups', function (Blueprint $table) {
            $table->foreignId('recycling_center_id')->nullable()->constrained('recycling_centers')->nullOnDelete();
            $table->timestamp('delivered_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('waste_pickups', function (Blueprint $table) {
            $table->dropForeign(['recycling_center_id']);
            $table->dropColumn(['recycling_center_id', 'delivered_at']);
        });
    }
};
