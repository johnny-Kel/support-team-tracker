<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint; // <--- This was missing!
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('task_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Bio details link
            $table->enum('status', ['pending', 'done'])->default('pending');
            $table->text('remark')->nullable(); // e.g., "500 vs 502 logs"
            $table->timestamps(); // Captures "time it was done"
            
            // Index for faster reporting queries on dates
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('task_entries');
    }
};