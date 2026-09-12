<?php

use App\Models\Quote;
use App\Models\User;
use App\Notifications\QuoteLiked;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests cannot list notifications', function () {
	$this->getJson(route('notifications.index'))->assertUnauthorized();
});

test('a signed-in user can list their own notifications with the liker\'s name', function () {
	$user = User::factory()->create();
	$liker = User::factory()->create();
	$quote = Quote::factory()->for($user)->create();
	$user->notify(new QuoteLiked($quote->likes()->create(['user_id' => $liker->id])));

	$response = $this->actingAs($user)->getJson(route('notifications.index'));

	$response->assertOk();
	$response->assertJsonCount(1);
	$response->assertJsonPath('0.data.kind', 'like');
	$response->assertJsonPath('0.data.liker', $liker->username);
});

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
