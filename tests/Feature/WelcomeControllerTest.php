<?php

use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

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
		->each(fn (Movie $movie) => $movie->addMedia(UploadedFile::fake()->create('poster.jpg', 100, 'image/jpeg'))->toMediaCollection('poster'));

	$response = $this->get(route('welcome'));

	$response->assertInertia(
		fn ($page) => $page
		->component('Welcome')
		->has('quotes', 3)
		->where('quotes.0.movie.poster_url', fn ($url) => $url !== '')
	);
});
