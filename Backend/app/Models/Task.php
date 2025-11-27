<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    
    // Add the new fields to fillable
    protected $fillable = [
        'title', 
        'description', 
        'is_active',
        'priority',
        'start_date',
        'deadline',
        'status',
        'assigned_user_id'
    ];

    // Cast dates so they behave like Carbon objects (easy formatting)
    protected $casts = [
        'start_date' => 'date',
        'deadline' => 'date',
        'is_active' => 'boolean',
    ];

    // Relationship: Who is this assigned to?
    public function assignee() {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    // Keep existing relationship for history logs
    public function entries() {
        return $this->hasMany(TaskEntry::class);
    }
}