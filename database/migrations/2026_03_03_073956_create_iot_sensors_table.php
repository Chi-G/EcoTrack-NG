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
        Schema::create('iot_sensors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recycling_center_id')->constrained('recycling_centers')->onDelete('cascade');
            $table->string('sensor_type');
            $table->decimal('last_reading', 10, 2)->nullable();
            $table->enum('status', ['active', 'inactive', 'maintenance'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iot_sensors');
    }
};
