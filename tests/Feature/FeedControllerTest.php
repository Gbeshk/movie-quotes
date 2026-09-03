<?php

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected away from the feed', function () {
	$this->get(route('feed'))->assertRedirect(route('login'));
});

test('the feed lists movies from every user', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();

	$ownMovie = Movie::factory()->for($user)->create();
	$othersMovie = Movie::factory()->for($otherUser)->create();

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->has('movies', 2)
			->where(
				'movies',
				fn ($movies) => collect($movies)->pluck('id')->sort()->values()->all()
					=== collect([$ownMovie->id, $othersMovie->id])->sort()->values()->all()
			)
	);
});
