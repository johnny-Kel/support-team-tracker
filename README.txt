# Support Team Daily Tracking System

## Project Overview
This system tracks daily activities of the application support team, allowing for task logging, handovers, and reporting.

## Folder Structure
- **/backend**: Laravel 11 API (Handles Logic, Database, Auth)
- **/frontend**: React + Vite (Handles UI, Dashboard, Reporting)

## Prerequisites
1. PHP (>= 8.2) & Composer
2. Node.js & NPM
3. MySQL Database

## Setup Instructions

### 1. Backend Setup
1. Open terminal in `/backend`
2. Run `composer install`
3. Copy `.env.example` to `.env` and configure your database (DB_DATABASE=support_tracker).
4. Run `php artisan key:generate`
5. Run `php artisan migrate` (This creates the Users, Tasks, and Entries tables)
6. Run `php artisan serve`
   > Server will start at: http://127.0.0.1:8000

### 2. Frontend Setup
1. Open a NEW terminal in `/frontend`
2. Run `npm install`
3. Run `npm run dev`
4. Open the link shown (usually http://localhost:5173)

## Login Credentials
(If you want to provide a test user for the grader)
- Email: admin@test.com
- Password: password