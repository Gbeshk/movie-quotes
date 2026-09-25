<?php

use App\Events\CommentPosted;
use App\Events\QuoteLikeToggled;
use App\Models\Comment;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('QuoteLikeToggled broadcasts the current like count on the quote\'s public channel', function () {
	$quote = Quote::factory()->create();
	$quote->likes()->create(['user_id' => User::factory()->create()->id]);

	$event = new QuoteLikeToggled($quote);

	expect($event->broadcastOn()[0]->name)->toBe("quote.{$quote->id}");
	expect($event->broadcastAs())->toBe('QuoteLikeToggled');
	expect($event->broadcastWith())->toBe(['likes_count' => 1]);
});

test('CommentPosted broadcasts the comment and current comment count on the quote\'s public channel', function () {
	$quote = Quote::factory()->create();
	$comment = Comment::factory()->for($quote)->create(['body' => 'Great line!']);

	$event = new CommentPosted($comment);

	expect($event->broadcastOn()[0]->name)->toBe("quote.{$quote->id}");
	expect($event->broadcastAs())->toBe('CommentPosted');

	$payload = $event->broadcastWith();
	expect($payload['comments_count'])->toBe(1);
	expect($payload['comment']['id'])->toBe($comment->id);
	expect($payload['comment']['body'])->toBe('Great line!');
});
