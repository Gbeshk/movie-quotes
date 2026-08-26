<?php

use App\Http\Controllers\MovieController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
	Route::get('/dashboard', function () {
		return Inertia::render('Dashboard');
	})->name('dashboard');

	Route::controller(ProfileController::class)->name('profile.')->group(function () {
		Route::get('/profile', 'edit')->name('edit');
		Route::patch('/profile', 'update')->name('update');
		Route::delete('/profile', 'destroy')->name('destroy');
	});

	Route::resource('movies', MovieController::class)->except(['create', 'edit']);
});

require __DIR__ . '/auth.php';
