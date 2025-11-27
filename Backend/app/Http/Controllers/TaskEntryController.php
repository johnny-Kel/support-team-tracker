<?php

namespace App\Http\Controllers;

use App\Models\TaskEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class TaskEntryController extends Controller
{
    /**
     * Input an activity update (Done/Pending + Remark)
     * Automatically captures User ID and Time.
     */
    public function store(Request $request) {
        $fields = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'status' => 'required|in:pending,done',
            'remark' => 'required|string'
        ]);

        $entry = TaskEntry::create([
            'task_id' => $fields['task_id'],
            'user_id' => $request->user()->id, // Capture Bio Details automatically
            'status' => $fields['status'],
            'remark' => $fields['remark']
        ]);

        return response()->json($entry, 201);
    }

    /**
     * Daily View / Handover View
     * Shows all updates made TODAY with User info and Task info.
     */
    public function dailyView() {
        $today = Carbon::today();

        $activities = TaskEntry::with(['user:id,name,email', 'task:id,title'])
            ->whereDate('created_at', $today)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'date' => $today->toDateString(),
            'total_updates' => $activities->count(),
            'data' => $activities
        ]);
    }

    /**
     * Reporting View
     * Query history based on custom durations (Start Date - End Date).
     */
    public function report(Request $request) {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'user_id' => 'nullable|exists:users,id', // Optional filter by user
            'task_id' => 'nullable|exists:tasks,id'  // Optional filter by task type
        ]);

        $query = TaskEntry::with(['user:id,name', 'task:id,title'])
            ->whereBetween('created_at', [
                Carbon::parse($request->start_date)->startOfDay(),
                Carbon::parse($request->end_date)->endOfDay()
            ]);

        // Optional filters
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->has('task_id')) {
            $query->where('task_id', $request->task_id);
        }

        $history = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'range' => $request->start_date . ' to ' . $request->end_date,
            'count' => $history->count(),
            'data' => $history
        ]);
    }
}