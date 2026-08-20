<?php

use App\Http\Controllers\MovieController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
	return Inertia::render('Welcome', [
		'canLogin'       => Route::has('login'),
		'canRegister'    => Route::has('register'),
		'laravelVersion' => Application::VERSION,
		'phpVersion'     => PHP_VERSION,
	]);
});

Route::get('/dashboard', function () {
	return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
	Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
	Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
	Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

	Route::get('/movies', [MovieController::class, 'index'])->name('movies.index');
	Route::post('/movies', [MovieController::class, 'store'])->name('movies.store');
	Route::get('/movies/{movie}', [MovieController::class, 'show'])->name('movies.show');
	Route::patch('/movies/{movie}', [MovieController::class, 'update'])->name('movies.update');
	Route::delete('/movies/{movie}', [MovieController::class, 'destroy'])->name('movies.destroy');
});

require __DIR__ . '/auth.php';
