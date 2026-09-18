<?php

use App\Models\Quote;
use App\Models\User;
use App\Notifications\QuoteCommented;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

test('guests cannot add a comment', function () {
	$quote = Quote::factory()->create();

	$this->post(route('quotes.comments.store', $quote), ['body' => 'Nice quote'])
		->assertForbidden();
});

test('a signed-in user can add a comment to any quote', function () {
	$user = User::factory()->create();
	$author = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$response = $this->actingAs($user)->post(route('quotes.comments.store', $quote), [
		'body' => 'What a great line!',
	]);

	$response->assertRedirect(route('movies.show', $quote->movie_id));

	$comment = $quote->comments()->firstOrFail();
	expect($comment->user_id)->toBe($user->id);
	expect($comment->body)->toBe('What a great line!');
});

test('creating a comment without required fields fails validation', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.comments.store', $quote), []);

	$response->assertSessionHasErrors(['body']);
});

test('adding a comment with redirect_to feed returns to the feed', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.comments.store', $quote), [
		'body'        => 'Loved it',
		'redirect_to' => 'feed',
	]);

	$response->assertRedirect(route('feed'));
});

test('commenting on someone else\'s quote notifies the author', function () {
	Notification::fake();

	$user = User::factory()->create();
	$author = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$this->actingAs($user)->post(route('quotes.comments.store', $quote), [
		'body' => 'Loved it',
	]);

	Notification::assertSentTo($author, QuoteCommented::class);
});

test('commenting on your own quote does not notify yourself', function () {
	Notification::fake();

	$user = User::factory()->create();
	$quote = Quote::factory()->for($user)->create();

	$this->actingAs($user)->post(route('quotes.comments.store', $quote), [
		'body' => 'My own thoughts',
	]);

	Notification::assertNothingSent();
});
