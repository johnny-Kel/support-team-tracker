<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskEntry extends Model
{
    use HasFactory;

    protected $fillable = ['task_id', 'user_id', 'status', 'remark'];

    // Relationship: Belongs to a specific Task
    public function task() {
        return $this->belongsTo(Task::class);
    }

    // Relationship: Belongs to the User who updated it
    public function user() {
        return $this->belongsTo(User::class);
    }
}