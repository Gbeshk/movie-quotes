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

	Route::controller(ProfileController::class)->prefix('profile')->name('profile.')->group(function () {
		Route::get('/', 'edit')->name('edit');
		Route::patch('/', 'update')->name('update');
		Route::post('/avatar', 'updateAvatar')->name('avatar');
		Route::delete('/', 'destroy')->name('destroy');
	});

	Route::resource('movies', MovieController::class)->except(['create', 'edit']);
});

require __DIR__ . '/auth.php';
