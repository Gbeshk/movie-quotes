<?php

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('movie factory creates a persisted movie owned by a user', function () {
	$movie = Movie::factory()->create();

	$this->assertDatabaseHas('movies', ['id' => $movie->id]);
	expect($movie->user)->toBeInstanceOf(User::class);
});

test('movie belongs to the user that created it', function () {
	$owner = User::factory()->create();
	$movie = Movie::factory()->for($owner)->create();

	expect($movie->user->is($owner))->toBeTrue();
});

test('release year is cast to an integer', function () {
	$movie = Movie::factory()->create(['release_year' => '1994']);

	expect($movie->release_year)->toBeInt()->toBe(1994);
});
