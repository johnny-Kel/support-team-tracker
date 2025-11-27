<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Get simple list of users for dropdowns
    public function index() {
        return User::select('id', 'name')->get();
    }
}