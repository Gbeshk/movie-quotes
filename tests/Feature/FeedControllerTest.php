<?php

use App\Models\Comment;
use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected away from the feed', function () {
	$this->get(route('feed'))->assertRedirect(route('login'));
});

test('the feed lists quotes from every user, including the current user', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();

	$ownQuote = Quote::factory()->for($user)->create();
	$othersQuote = Quote::factory()->for($otherUser)->create();

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->has('quotes.data', 2)
			->where(
				'quotes.data',
				fn ($quotes) => collect($quotes)->pluck('id')->sort()->values()->all()
					=== collect([$ownQuote->id, $othersQuote->id])->sort()->values()->all()
			)
	);
});

test('the feed includes each quote\'s movie', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();
	$movie = Movie::factory()->create();
	$quote = Quote::factory()->for($movie)->for($otherUser)->create();

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->where('quotes.data.0.id', $quote->id)
			->where('quotes.data.0.movie.id', $movie->id)
	);
});

test('the feed includes each quote\'s comments with their authors, oldest first', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();
	$quote = Quote::factory()->for($otherUser)->create();

	$firstComment = Comment::factory()->for($quote)->create(['created_at' => now()->subMinute()]);
	$secondComment = Comment::factory()->for($quote)->create(['created_at' => now()]);

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->has('quotes.data.0.comments', 2)
			->where('quotes.data.0.comments.0.id', $firstComment->id)
			->where('quotes.data.0.comments.0.body', $firstComment->body)
			->where('quotes.data.0.comments.0.user.id', $firstComment->user_id)
			->where('quotes.data.0.comments.1.id', $secondComment->id)
	);
});

test('the feed does not load movie search results on a full page visit', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(fn ($page) => $page->component('Feed/Index')->missing('movieOptions'));
});

test('the feed returns matching movie search results on a partial reload', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();

	$matching = Movie::factory()->for($otherUser)->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	Movie::factory()->for($user)->create(['title' => ['en' => 'Inception', 'ka' => 'დასაწყისი']]);

	$response = $this->actingAs($user)->get(route('feed', ['movie_search' => 'matrix']), [
		'X-Inertia'                   => 'true',
		'X-Inertia-Version'           => hash_file('xxh128', public_path('build/manifest.json')),
		'X-Inertia-Partial-Data'      => 'movieOptions',
		'X-Inertia-Partial-Component' => 'Feed/Index',
	]);

	$response->assertOk();
	$response->assertJsonCount(1, 'props.movieOptions');
	$response->assertJsonPath('props.movieOptions.0.id', $matching->id);
});
