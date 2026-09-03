<?php

use App\Http\Controllers\FeedController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::middleware(['auth', EnsureEmailIsVerified::redirectTo('welcome')])->group(function () {
	Route::get('/feed', [FeedController::class, 'index'])->name('feed');

	Route::controller(ProfileController::class)->name('profile.')->group(function () {
		Route::get('/profile', 'edit')->name('edit');
		Route::patch('/profile', 'update')->name('update');
		Route::delete('/profile', 'destroy')->name('destroy');
	});

	Route::resource('movies', MovieController::class)->except(['create', 'edit']);
});

require __DIR__ . '/auth.php';
