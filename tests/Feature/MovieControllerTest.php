<?php

use App\Models\Comment;
use App\Models\Like;
use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('guests are forbidden from the movies index', function () {
	$this->get(route('movies.index'))->assertForbidden();
});

test('the movies index only lists the authenticated user\'s own movies', function () {
	$user = User::factory()->create();
	$otherUser = User::factory()->create();

	$ownMovie = Movie::factory()->for($user)->create();
	Movie::factory()->for($otherUser)->create();

	$response = $this->actingAs($user)->get(route('movies.index'));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Index')
		->has('movies.data', 1)
		->where('movies.data.0.id', $ownMovie->id)
		->where('moviesCount', 1)
	);
});

test('the movies index can be filtered by search', function () {
	$user = User::factory()->create();

	$matching = Movie::factory()->for($user)->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	Movie::factory()->for($user)->create(['title' => ['en' => 'Inception', 'ka' => 'დასაწყისი']]);

	$response = $this->actingAs($user)->get(route('movies.index', ['search' => 'matrix']));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Index')
		->has('movies.data', 1)
		->where('movies.data.0.id', $matching->id)
		->where('moviesCount', 1)
	);
});

test('the movies index can be filtered by search with an @ prefix', function () {
	$user = User::factory()->create();

	$matching = Movie::factory()->for($user)->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	Movie::factory()->for($user)->create(['title' => ['en' => 'Inception', 'ka' => 'დასაწყისი']]);

	$response = $this->actingAs($user)->get(route('movies.index', ['search' => '@matrix']));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Index')
		->has('movies.data', 1)
		->where('movies.data.0.id', $matching->id)
	);
});

test('the movies index can be filtered by search with a # prefix matching a quote', function () {
	$user = User::factory()->create();

	$matchingMovie = Movie::factory()->for($user)->create();
	Quote::factory()->for($matchingMovie)->create(['text' => ['en' => 'There is no spoon', 'ka' => 'კოვზი არ არსებობს']]);

	$otherMovie = Movie::factory()->for($user)->create();
	Quote::factory()->for($otherMovie)->create(['text' => ['en' => 'Why so serious', 'ka' => 'რატომ ხარ ასეთი სერიოზული']]);

	$response = $this->actingAs($user)->get(route('movies.index', ['search' => '#spoon']));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Index')
		->has('movies.data', 1)
		->where('movies.data.0.id', $matchingMovie->id)
	);
});

test('any signed-in user can view a movie they do not own', function () {
	$owner = User::factory()->create();
	$viewer = User::factory()->create();
	$movie = Movie::factory()->for($owner)->create();

	$response = $this->actingAs($viewer)->get(route('movies.show', $movie));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Show')
		->where('movie.id', $movie->id)
	);
});

test('the movie page lists its quotes with like and comment counts', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();
	$quote = Quote::factory()->for($movie)->create();
	Like::factory()->for($quote)->create();
	Comment::factory()->count(2)->for($quote)->create();

	$response = $this->actingAs($user)->get(route('movies.show', $movie));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Show')
		->has('quotes.data', 1)
		->where('quotes.data.0.id', $quote->id)
		->where('quotes.data.0.likes_count', 1)
		->where('quotes.data.0.comments_count', 2)
		->where('quotesCount', 1)
	);
});

test('the movie page sends both languages for the movie and its quotes', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create(['title' => ['en' => 'The Matrix', 'ka' => 'მატრიცა']]);
	$quote = Quote::factory()->for($movie)->for($user)->create(['text' => ['en' => 'There is no spoon', 'ka' => 'კოვზი არ არსებობს']]);

	$response = $this->actingAs($user)->get(route('movies.show', $movie));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Show')
		->where('movie.title.en', 'The Matrix')
		->where('movie.title.ka', 'მატრიცა')
		->where('quotes.data.0.text.en', 'There is no spoon')
		->where('quotes.data.0.text.ka', 'კოვზი არ არსებობს')
		->where('quotes.data.0.user_id', $user->id)
		->where('quotes.data.0.movie_id', $movie->id)
	);
});

test('the movie page marks whether the current user has liked each quote', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();
	$likedQuote = Quote::factory()->for($movie)->create();
	$unlikedQuote = Quote::factory()->for($movie)->create();
	Like::factory()->for($user)->for($likedQuote)->create();

	$response = $this->actingAs($user)->get(route('movies.show', $movie));

	$response->assertInertia(
		fn ($page) => $page
		->component('Movies/Show')
		->where(
			'quotes.data',
			fn ($quotes) => collect($quotes)->firstWhere('id', $likedQuote->id)['is_liked_by_me'] === true
				&& collect($quotes)->firstWhere('id', $unlikedQuote->id)['is_liked_by_me'] === false
		)
	);
});

test('guests are forbidden from a movie page', function () {
	$movie = Movie::factory()->create();

	$this->get(route('movies.show', $movie))->assertForbidden();
});

test('a signed-in user can add a movie with a poster', function () {
	Storage::fake('public');

	$user = User::factory()->create();

	$response = $this->actingAs($user)->post(route('movies.store'), [
		'title'        => ['ka' => 'ტესტი', 'en' => 'Test Movie'],
		'director'     => ['ka' => 'ტესტი რეჟისორი', 'en' => 'Test Director'],
		'genre'        => ['Drama'],
		'release_year' => 2020,
		'description'  => ['ka' => 'აღწერა', 'en' => 'Description'],
		'poster'       => UploadedFile::fake()->create('poster.jpg', 100, 'image/jpeg'),
	]);

	$response->assertRedirect(route('movies.index'));

	$movie = Movie::where('title->en', 'Test Movie')->firstOrFail();
	expect($movie->user_id)->toBe($user->id);
	expect($movie->getTranslation('title', 'ka'))->toBe('ტესტი');
	expect($movie->getFirstMediaUrl('poster'))->not->toBe('');
});

test('creating a movie without required fields fails validation', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->post(route('movies.store'), []);

	$response->assertSessionHasErrors([
		'title.ka', 'title.en', 'director.ka', 'director.en',
		'genre', 'release_year', 'description.ka', 'description.en', 'poster',
	]);
});

test('creating a movie with a title longer than 100 characters fails validation', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->post(route('movies.store'), [
		'title'        => ['ka' => str_repeat('ა', 101), 'en' => str_repeat('a', 101)],
		'director'     => ['ka' => 'ტესტი რეჟისორი', 'en' => 'Test Director'],
		'genre'        => ['Drama'],
		'release_year' => 2020,
		'description'  => ['ka' => 'აღწერა', 'en' => 'Description'],
	]);

	$response->assertSessionHasErrors(['title.ka', 'title.en']);
});

test('creating a movie with mismatched language text fails validation', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->post(route('movies.store'), [
		'title'        => ['ka' => 'Test Movie', 'en' => 'ტესტი'],
		'director'     => ['ka' => 'ტესტი რეჟისორი', 'en' => 'Test Director'],
		'genre'        => ['Drama'],
		'release_year' => 2020,
		'description'  => ['ka' => 'აღწერა', 'en' => 'Description'],
		'poster'       => UploadedFile::fake()->create('poster.jpg', 100, 'image/jpeg'),
	]);

	$response->assertSessionHasErrors(['title.ka', 'title.en']);
});

test('guests cannot add a movie', function () {
	$this->post(route('movies.store'), [])->assertForbidden();
});

test('the owner can update their movie', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();

	$response = $this->actingAs($user)->patch(route('movies.update', $movie), [
		'title'        => ['ka' => 'ახალი', 'en' => 'Updated Title'],
		'director'     => $movie->getTranslations('director'),
		'genre'        => $movie->genre,
		'release_year' => $movie->release_year,
		'description'  => $movie->getTranslations('description'),
	]);

	$response->assertRedirect(route('movies.show', $movie));
	expect($movie->fresh()->getTranslation('title', 'en'))->toBe('Updated Title');
});

test('updating a movie with mismatched language text fails validation', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();

	$response = $this->actingAs($user)->patch(route('movies.update', $movie), [
		'title'        => ['ka' => 'Updated Title', 'en' => 'ახალი'],
		'director'     => $movie->getTranslations('director'),
		'genre'        => $movie->genre,
		'release_year' => $movie->release_year,
		'description'  => $movie->getTranslations('description'),
	]);

	$response->assertSessionHasErrors(['title.ka', 'title.en']);
	expect($movie->fresh()->getTranslation('title', 'en'))->not->toBe('ახალი');
});

test('a user cannot update a movie they do not own', function () {
	$owner = User::factory()->create();
	$otherUser = User::factory()->create();
	$movie = Movie::factory()->for($owner)->create();

	$response = $this->actingAs($otherUser)->patch(route('movies.update', $movie), [
		'title'        => ['ka' => 'ახალი', 'en' => 'Updated Title'],
		'director'     => $movie->getTranslations('director'),
		'genre'        => $movie->genre,
		'release_year' => $movie->release_year,
		'description'  => $movie->getTranslations('description'),
	]);

	$response->assertForbidden();
	expect($movie->fresh()->getTranslation('title', 'en'))->not->toBe('Updated Title');
});

test('the owner can delete their movie', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();

	$response = $this->actingAs($user)->delete(route('movies.destroy', $movie));

	$response->assertRedirect(route('movies.index'));
	$this->assertModelMissing($movie);
});

test('a user cannot delete a movie they do not own', function () {
	$owner = User::factory()->create();
	$otherUser = User::factory()->create();
	$movie = Movie::factory()->for($owner)->create();

	$response = $this->actingAs($otherUser)->delete(route('movies.destroy', $movie));

	$response->assertForbidden();
	$this->assertModelExists($movie);
});

test('guests cannot update or delete a movie', function () {
	$movie = Movie::factory()->create();

	$this->patch(route('movies.update', $movie), [])->assertForbidden();
	$this->delete(route('movies.destroy', $movie))->assertForbidden();
});
