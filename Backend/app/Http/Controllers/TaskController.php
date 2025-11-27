<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // 1. GET ALL TASKS (Updated to include Assignee details)
    public function index(Request $request) {
        $query = Task::with('assignee')->where('is_active', true);

        // Optional: Filter by Start Date (For Daily Tracker)
        if ($request->has('date')) {
            $query->whereDate('start_date', $request->date);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    // 2. CREATE TASK (Updated with new validation)
    public function store(Request $request) {
        $fields = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'priority' => 'required|in:Low,Medium,High,Critical',
            'start_date' => 'required|date',
            'deadline' => 'required|date|after_or_equal:start_date',
            'status' => 'required|in:Pending,In-Progress,On-Hold,Completed',
            'assigned_user_id' => 'required|exists:users,id'
        ]);

        return Task::create($fields);
    }

    // 3. UPDATE TASK (Full Editing & Reassignment)
    public function update(Request $request, $id) {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        $fields = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'priority' => 'sometimes|in:Low,Medium,High,Critical',
            'start_date' => 'sometimes|date',
            'deadline' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|in:Pending,In-Progress,On-Hold,Completed',
            'assigned_user_id' => 'sometimes|exists:users,id'
        ]);

        $task->update($fields);
        
        // Return fresh data with assignee info
        return $task->load('assignee');
    }

    // 4. DELETE (Soft Delete)
    public function destroy($id) {
        $task = Task::find($id);
        if ($task) {
            $task->update(['is_active' => false]);
        }
        return response()->json(['message' => 'Task deactivated']);
    }
}