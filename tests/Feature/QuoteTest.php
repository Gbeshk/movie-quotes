<?php

use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('quote factory creates a persisted quote owned by a movie and a user', function () {
	$quote = Quote::factory()->create();

	$this->assertDatabaseHas('quotes', ['id' => $quote->id]);
	expect($quote->movie)->toBeInstanceOf(Movie::class);
	expect($quote->user)->toBeInstanceOf(User::class);
});

test('quote belongs to the movie it was added to', function () {
	$movie = Movie::factory()->create();
	$quote = Quote::factory()->for($movie)->create();

	expect($quote->movie->is($movie))->toBeTrue();
});

test('a movie can have many quotes', function () {
	$movie = Movie::factory()->create();
	Quote::factory()->count(3)->for($movie)->create();

	expect($movie->quotes()->count())->toBe(3);
});
