<?php

use App\Models\Comment;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('comment factory creates a persisted comment tied to a user and a quote', function () {
	$comment = Comment::factory()->create();

	$this->assertDatabaseHas('comments', ['id' => $comment->id]);
	expect($comment->user)->toBeInstanceOf(User::class);
	expect($comment->quote)->toBeInstanceOf(Quote::class);
});

test('a user can leave multiple comments on the same quote', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	Comment::factory()->for($user)->for($quote)->create();
	Comment::factory()->for($user)->for($quote)->create();

	expect($quote->comments()->where('user_id', $user->id)->count())->toBe(2);
});

test('a quote reports how many comments it has', function () {
	$quote = Quote::factory()->create();
	Comment::factory()->count(3)->for($quote)->create();

	expect($quote->comments()->count())->toBe(3);
});
