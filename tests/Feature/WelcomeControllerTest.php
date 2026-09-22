<?php

use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('guests do not receive a notifications prop', function () {
	$response = $this->get(route('welcome'));

	$response->assertInertia(fn ($page) => $page->where('notifications', null));
});

test('a signed-in user visiting the welcome page is redirected to the feed', function () {
	$user = User::factory()->create();

	$this->actingAs($user)->get(route('welcome'))->assertRedirect(route('feed'));
});

test('a signed-in user is not redirected away from the email verified confirmation', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->get(route('welcome', ['verified' => 1]));

	$response->assertOk();
	$response->assertInertia(fn ($page) => $page->component('Welcome'));
});

test('a signed-in user is not redirected away from the password reset flow', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->get(route('welcome', ['reset_token' => 'abc123', 'reset_email' => 'user@example.com']));

	$response->assertOk();
	$response->assertInertia(fn ($page) => $page->component('Welcome'));
});

test('the welcome page reports whether an email was just verified', function () {
	$response = $this->get(route('welcome', ['verified' => 1]));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->where('emailJustVerified', true)
	);

	$response = $this->get(route('welcome'));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->where('emailJustVerified', false)
	);
});

test('the welcome page passes the reset password token and email from the query string', function () {
	$response = $this->get(route('welcome', ['reset_token' => 'abc123', 'reset_email' => 'user@example.com']));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->where('resetPasswordToken', 'abc123')
		->where('resetPasswordEmail', 'user@example.com')
	);
});

test('the welcome page reports whether the reset password token is expired', function () {
	$response = $this->get(route('welcome', ['reset_expired' => 1]));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->where('resetTokenExpired', true)
	);

	$response = $this->get(route('welcome'));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->where('resetTokenExpired', false)
	);
});

test('the welcome page falls back to hardcoded quotes when fewer than 3 movies have a poster', function () {
	$response = $this->get(route('welcome'));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->has('quotes', 3)
		->where('quotes.0.id', 'fallback-1')
		->where('quotes.1.id', 'fallback-2')
		->where('quotes.2.id', 'fallback-3')
	);
});

test('the welcome page shows 3 random quotes from movies that have a poster', function () {
	Storage::fake('public');

	Movie::factory()
		->count(5)
		->has(Quote::factory())
		->create()
		->each(function (Movie $movie) {
			$movie->addMedia(UploadedFile::fake()->create('poster.jpg', 100, 'image/jpeg'))->toMediaCollection('poster');
			$movie->quotes->each(
				fn (Quote $quote) => $quote->addMedia(UploadedFile::fake()->create('quote.jpg', 100, 'image/jpeg'))->toMediaCollection('image')
			);
		});

	$response = $this->get(route('welcome'));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->has('quotes', 3)
		->where('quotes.0.image_url', fn ($url) => $url !== '')
		->where('quotes.0.movie.poster_url', fn ($url) => $url !== '')
	);
});

test('a quote without its own image falls back to the movie poster on the welcome page', function () {
	Storage::fake('public');

	Movie::factory()
		->count(3)
		->has(Quote::factory())
		->create()
		->each(function (Movie $movie) {
			$movie->addMedia(UploadedFile::fake()->create('poster.jpg', 100, 'image/jpeg'))->toMediaCollection('poster');
		});

	$response = $this->get(route('welcome'));

	$response->assertInertia(function ($page) {
		$page->component('Welcome')->has('quotes', 3);

		$quotes = collect($page->toArray()['props']['quotes']);

		expect(
			$quotes->every(fn ($quote) => $quote['image_url'] !== '' && $quote['image_url'] === $quote['movie']['poster_url'])
		)->toBeTrue();
	});
});

test('the welcome page never shows two quotes from the same movie', function () {
	Storage::fake('public');

	Movie::factory()
		->count(4)
		->has(Quote::factory()->count(3))
		->create()
		->each(function (Movie $movie) {
			$movie->addMedia(UploadedFile::fake()->create('poster.jpg', 100, 'image/jpeg'))->toMediaCollection('poster');
			$movie->quotes->each(
				fn (Quote $quote) => $quote->addMedia(UploadedFile::fake()->create('quote.jpg', 100, 'image/jpeg'))->toMediaCollection('image')
			);
		});

	$response = $this->get(route('welcome'));

	$response->assertInertia(function ($page) {
		$page->component('Welcome')->has('quotes', 3);

		$posterUrls = collect($page->toArray()['props']['quotes'])
			->pluck('movie.poster_url');

		expect($posterUrls->unique())->toHaveCount(3);
	});
});
