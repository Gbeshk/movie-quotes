<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\MovieController;
use App\Http\Controllers\NotificationController;
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

	Route::controller(MovieController::class)->prefix('movies')->name('movies.')->group(function () {
		Route::get('/', 'index')->name('index');
		Route::post('/', 'store')->name('store');
		Route::get('/{movie}', 'show')->name('show');
		Route::match(['put', 'patch'], '/{movie}', 'update')->name('update');
		Route::delete('/{movie}', 'destroy')->name('destroy');
	});

	Route::controller(QuoteController::class)->prefix('quotes')->name('quotes.')->group(function () {
		Route::post('/', 'store')->name('store');
		Route::patch('/{quote}', 'update')->name('update');
		Route::delete('/{quote}', 'destroy')->name('destroy');

		Route::post('/{quote}/comments', [CommentController::class, 'store'])->name('comments.store');
		Route::post('/{quote}/likes/toggle', [LikeController::class, 'toggle'])->name('likes.toggle');
	});

	Route::controller(NotificationController::class)->prefix('notifications')->name('notifications.')->group(function () {
		Route::post('/read', 'markAllRead')->name('read');
	});
});

require __DIR__ . '/auth.php';
