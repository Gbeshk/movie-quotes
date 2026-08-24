<?php

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('guests are redirected away from the movies index', function () {
	$this->get(route('movies.index'))->assertRedirect(route('login'));
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
		->has('movies', 1)
		->where('movies.0.id', $ownMovie->id)
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

test('guests are redirected away from a movie page', function () {
	$movie = Movie::factory()->create();

	$this->get(route('movies.show', $movie))->assertRedirect(route('login'));
});

test('a signed-in user can add a movie with a poster', function () {
	Storage::fake('public');

	$user = User::factory()->create();

	$response = $this->actingAs($user)->post(route('movies.store'), [
		'title'        => ['ka' => 'ტესტი', 'en' => 'Test Movie'],
		'director'     => ['ka' => 'ტესტი რეჟისორი', 'en' => 'Test Director'],
		'genre'        => 'Drama',
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

test('guests cannot add a movie', function () {
	$this->post(route('movies.store'), [])->assertRedirect(route('login'));
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

	$this->patch(route('movies.update', $movie), [])->assertRedirect(route('login'));
	$this->delete(route('movies.destroy', $movie))->assertRedirect(route('login'));
});
