<?php

use App\Http\Controllers\FeedController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuoteController;
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

	Route::get('/movies/search', [MovieController::class, 'search'])->name('movies.search');
	Route::resource('movies', MovieController::class)->except(['create', 'edit']);

	Route::controller(QuoteController::class)->prefix('quotes')->name('quotes.')->group(function () {
		Route::post('/', 'store')->name('store');
		Route::patch('/{quote}', 'update')->name('update');
		Route::delete('/{quote}', 'destroy')->name('destroy');
	});
});

require __DIR__ . '/auth.php';
