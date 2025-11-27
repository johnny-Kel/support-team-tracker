<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskEntryController;
use App\Http\Controllers\UserController; // <--- Import this

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Requires Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // --- NEW: Users List (For Dropdowns) ---
    Route::get('/users', [UserController::class, 'index']);

    // Task Definitions (CRUD for Tasks)
    Route::apiResource('tasks', TaskController::class);

    // Daily Activities / Handover / Reporting
    Route::post('/activities', [TaskEntryController::class, 'store']); 
    Route::get('/activities/daily', [TaskEntryController::class, 'dailyView']); 
    Route::get('/activities/report', [TaskEntryController::class, 'report']); 
});