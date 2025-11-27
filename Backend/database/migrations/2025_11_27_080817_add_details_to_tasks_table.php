<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // New Requirement Fields
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
            $table->date('start_date')->nullable();
            $table->date('deadline')->nullable();
            
            // We are moving status to the Task itself now (Jira style)
            $table->enum('status', ['Pending', 'In-Progress', 'On-Hold', 'Completed'])->default('Pending');
            
            // Assignment (Assigned To)
            // nullable() because a task might be unassigned initially
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['assigned_user_id']);
            $table->dropColumn(['priority', 'start_date', 'deadline', 'status', 'assigned_user_id']);
        });
    }
};