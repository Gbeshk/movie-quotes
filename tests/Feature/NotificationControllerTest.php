<?php

use App\Models\Quote;
use App\Models\User;
use App\Notifications\QuoteLiked;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests cannot mark notifications as read', function () {
	$this->post(route('notifications.read'))->assertRedirect(route('login'));
});

test('a signed-in user can mark all their notifications as read', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->for($user)->create();
	$user->notify(new QuoteLiked($quote->likes()->create(['user_id' => $user->id])));

	expect($user->unreadNotifications()->count())->toBe(1);

	$response = $this->actingAs($user)->post(route('notifications.read'));

	$response->assertNoContent();
	expect($user->unreadNotifications()->count())->toBe(0);
});

test('the unread notifications count is shared on every authenticated page', function () {
	$user = User::factory()->create();
	$quote = Quote::factory()->for($user)->create();
	$user->notify(new QuoteLiked($quote->likes()->create(['user_id' => $user->id])));

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(fn ($page) => $page->where('unreadNotificationsCount', 1));
});

test('the notifications list is shared on every authenticated page with the liker\'s name', function () {
	$user = User::factory()->create();
	$liker = User::factory()->create();
	$quote = Quote::factory()->for($user)->create();
	$user->notify(new QuoteLiked($quote->likes()->create(['user_id' => $liker->id])));

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(
		fn ($page) => $page
		->has('notifications', 1)
		->where('notifications.0.data.kind', 'like')
		->where('notifications.0.data.liker', $liker->username)
	);
});
