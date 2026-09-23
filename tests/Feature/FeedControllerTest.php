<?php

use App\Models\Comment;
use App\Models\Like;
use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are forbidden from the feed', function () {
	$this->get(route('feed'))->assertForbidden();
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

test('the feed sends both languages for the quote text and movie title', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	$quote = Quote::factory()->for($movie)->for($user)->create(['text' => ['en' => 'There is no spoon', 'ka' => 'კოვზი არ არსებობს']]);

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->where('quotes.data.0.id', $quote->id)
			->where('quotes.data.0.text.en', 'There is no spoon')
			->where('quotes.data.0.text.ka', 'კოვზი არ არსებობს')
			->where('quotes.data.0.movie.title.en', 'The Matrix')
			->where('quotes.data.0.movie.title.ka', 'მატრიცა')
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

test('the feed marks whether the current user has liked each quote', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();

	$likedQuote = Quote::factory()->for($otherUser)->create();
	$unlikedQuote = Quote::factory()->for($otherUser)->create();
	Like::factory()->for($user)->for($likedQuote)->create();

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->where(
				'quotes.data',
				fn ($quotes) => collect($quotes)->firstWhere('id', $likedQuote->id)['is_liked_by_me'] === true
					&& collect($quotes)->firstWhere('id', $unlikedQuote->id)['is_liked_by_me'] === false
			)
	);
});

test('the feed includes each quote\'s comments with their authors, newest first', function () {
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
			->where('quotes.data.0.comments.0.id', $secondComment->id)
			->where('quotes.data.0.comments.0.body', $secondComment->body)
			->where('quotes.data.0.comments.0.user.id', $secondComment->user_id)
			->where('quotes.data.0.comments.1.id', $firstComment->id)
	);
});

test('the feed does not load movie search results on a full page visit', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->get(route('feed'));

	$response->assertInertia(fn ($page) => $page->component('Feed/Index')->missing('movieOptions'));
});

test('searching the feed with an @ prefix filters quotes by movie title', function () {
	$user = User::factory()->create();

	$matrixMovie = Movie::factory()->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	$otherMovie = Movie::factory()->create(['title' => ['en' => 'Inception', 'ka' => 'დასაწყისი']]);
	$matchingQuote = Quote::factory()->for($matrixMovie)->create();
	Quote::factory()->for($otherMovie)->create();

	$response = $this->actingAs($user)->get(route('feed', ['filter' => ['search' => '@matrix']]));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->has('quotes.data', 1)
			->where('quotes.data.0.id', $matchingQuote->id)
	);
});

test('searching the feed with a # prefix filters quotes by their own text', function () {
	$user = User::factory()->create();

	$matchingQuote = Quote::factory()->create(['text' => ['en' => 'There is no spoon', 'ka' => 'კოვზი არ არსებობს']]);
	Quote::factory()->create(['text' => ['en' => 'Why so serious', 'ka' => 'რატომ ხარ ასეთი სერიოზული']]);

	$response = $this->actingAs($user)->get(route('feed', ['filter' => ['search' => '#spoon']]));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->has('quotes.data', 1)
			->where('quotes.data.0.id', $matchingQuote->id)
	);
});

test('searching the feed without an @ or # prefix matches either the movie title or the quote text', function () {
	$user = User::factory()->create();

	$movieTitleMatch = Movie::factory()->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	$matchingByMovie = Quote::factory()->for($movieTitleMatch)->create(['text' => ['en' => 'Whoa', 'ka' => 'ვაუ']]);
	$matchingByText = Quote::factory()->create(['text' => ['en' => 'There is no spoon', 'ka' => 'კოვზი არ არსებობს']]);
	Quote::factory()->create(['text' => ['en' => 'Why so serious', 'ka' => 'რატომ ხარ ასეთი სერიოზული']]);

	$response = $this->actingAs($user)->get(route('feed', ['filter' => ['search' => 'matrix']]));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->has('quotes.data', 1)
			->where('quotes.data.0.id', $matchingByMovie->id)
	);

	$response = $this->actingAs($user)->get(route('feed', ['filter' => ['search' => 'spoon']]));

	$response->assertInertia(
		fn ($page) => $page
			->component('Feed/Index')
			->has('quotes.data', 1)
			->where('quotes.data.0.id', $matchingByText->id)
	);
});

test('the feed only returns the current user\'s own matching movies on a partial reload', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();

	$ownMatch = Movie::factory()->for($user)->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	Movie::factory()->for($otherUser)->create(['title' => ['en' => 'The Matrix Reloaded', 'ka' => 'მატრიცა 2']]);
	Movie::factory()->for($user)->create(['title' => ['en' => 'Inception', 'ka' => 'დასაწყისი']]);

	$response = $this->actingAs($user)->get(route('feed', ['movie_search' => 'matrix']), [
		'X-Inertia'                   => 'true',
		'X-Inertia-Version'           => hash_file('xxh128', public_path('build/manifest.json')),
		'X-Inertia-Partial-Data'      => 'movieOptions',
		'X-Inertia-Partial-Component' => 'Feed/Index',
	]);

	$response->assertOk();
	$response->assertJsonCount(1, 'props.movieOptions');
	$response->assertJsonPath('props.movieOptions.0.id', $ownMatch->id);
});
