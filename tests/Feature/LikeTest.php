<?php

use App\Models\Like;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('like factory creates a persisted like tied to a user and a quote', function () {
	$like = Like::factory()->create();

	$this->assertDatabaseHas('likes', ['id' => $like->id]);
	expect($like->user)->toBeInstanceOf(User::class);
	expect($like->quote)->toBeInstanceOf(Quote::class);
});

test('a user cannot like the same quote twice', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	Like::factory()->for($user)->for($quote)->create();

	expect(fn () => Like::factory()->for($user)->for($quote)->create())
		->toThrow(QueryException::class);
});

test('a quote reports how many likes it has', function () {
	$quote = Quote::factory()->create();
	Like::factory()->count(2)->for($quote)->create();

	expect($quote->likes()->count())->toBe(2);
});
