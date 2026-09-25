<?php

use App\Events\QuoteLikeToggled;
use App\Models\Quote;
use App\Models\User;
use App\Notifications\QuoteLiked;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

test('guests cannot like a quote', function () {
	$quote = Quote::factory()->create();

	$this->post(route('quotes.likes.toggle', $quote))->assertForbidden();
});

test('a signed-in user can like a quote', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.likes.toggle', $quote));

	$response->assertStatus(302);
	expect($quote->likes()->where('user_id', $user->id)->exists())->toBeTrue();
});

test('liking an already-liked quote unlikes it', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$this->actingAs($user)->post(route('quotes.likes.toggle', $quote));
	$this->actingAs($user)->post(route('quotes.likes.toggle', $quote));

	expect($quote->likes()->where('user_id', $user->id)->exists())->toBeFalse();
});

test('liking a quote redirects back to the page it was liked from', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$response = $this->actingAs($user)
		->from(route('feed'))
		->post(route('quotes.likes.toggle', $quote));

	$response->assertRedirect(route('feed'));

	$response = $this->actingAs($user)
		->from(route('movies.show', $quote->movie_id))
		->post(route('quotes.likes.toggle', $quote));

	$response->assertRedirect(route('movies.show', $quote->movie_id));
});

test('liking someone else\'s quote notifies the author', function () {
	Notification::fake();

	$user = User::factory()->create();
	$author = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$this->actingAs($user)->post(route('quotes.likes.toggle', $quote));

	Notification::assertSentTo($author, QuoteLiked::class);
});

test('liking your own quote does not notify yourself', function () {
	Notification::fake();

	$user = User::factory()->create();
	$quote = Quote::factory()->for($user)->create();

	$this->actingAs($user)->post(route('quotes.likes.toggle', $quote));

	Notification::assertNothingSent();
});

test('unliking a quote does not send another notification', function () {
	Notification::fake();

	$user = User::factory()->create();
	$author = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$this->actingAs($user)->post(route('quotes.likes.toggle', $quote));
	$this->actingAs($user)->post(route('quotes.likes.toggle', $quote));

	Notification::assertSentToTimes($author, QuoteLiked::class, 1);
});

test('liking a quote broadcasts the updated like count to other viewers', function () {
	Event::fake([QuoteLikeToggled::class]);

	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$this->actingAs($user)->post(route('quotes.likes.toggle', $quote));

	Event::assertDispatched(
		QuoteLikeToggled::class,
		fn (QuoteLikeToggled $event) => $event->quote->is($quote),
	);
});
