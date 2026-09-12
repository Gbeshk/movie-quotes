<?php

use App\Models\Quote;
use App\Models\User;
use App\Notifications\QuoteLiked;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

test('guests cannot like a quote', function () {
	$quote = Quote::factory()->create();

	$this->post(route('likes.toggle'), ['quote_id' => $quote->id])->assertRedirect(route('login'));
});

test('a signed-in user can like a quote', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$response = $this->actingAs($user)->post(route('likes.toggle'), ['quote_id' => $quote->id]);

	$response->assertRedirect(route('movies.show', $quote->movie_id));
	expect($quote->likes()->where('user_id', $user->id)->exists())->toBeTrue();
});

test('liking an already-liked quote unlikes it', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$this->actingAs($user)->post(route('likes.toggle'), ['quote_id' => $quote->id]);
	$this->actingAs($user)->post(route('likes.toggle'), ['quote_id' => $quote->id]);

	expect($quote->likes()->where('user_id', $user->id)->exists())->toBeFalse();
});

test('liking a quote without required fields fails validation', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->post(route('likes.toggle'), []);

	$response->assertSessionHasErrors(['quote_id']);
});

test('liking a quote with redirect_to feed returns to the feed', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->create();

	$response = $this->actingAs($user)->post(route('likes.toggle'), [
		'quote_id'    => $quote->id,
		'redirect_to' => 'feed',
	]);

	$response->assertRedirect(route('feed'));
});

test('liking someone else\'s quote notifies the author', function () {
	Notification::fake();

	$user = User::factory()->create();
	$author = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$this->actingAs($user)->post(route('likes.toggle'), ['quote_id' => $quote->id]);

	Notification::assertSentTo($author, QuoteLiked::class);
});

test('liking your own quote does not notify yourself', function () {
	Notification::fake();

	$user = User::factory()->create();
	$quote = Quote::factory()->for($user)->create();

	$this->actingAs($user)->post(route('likes.toggle'), ['quote_id' => $quote->id]);

	Notification::assertNothingSent();
});

test('unliking a quote does not send another notification', function () {
	Notification::fake();

	$user = User::factory()->create();
	$author = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$this->actingAs($user)->post(route('likes.toggle'), ['quote_id' => $quote->id]);
	$this->actingAs($user)->post(route('likes.toggle'), ['quote_id' => $quote->id]);

	Notification::assertSentToTimes($author, QuoteLiked::class, 1);
});
