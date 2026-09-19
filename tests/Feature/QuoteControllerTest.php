<?php

use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('guests cannot view a quote', function () {
	$quote = Quote::factory()->create();

	$this->getJson(route('quotes.show', $quote))->assertUnauthorized();
});

test('a signed-in user can view any quote with its comments and like state', function () {
	$user = User::factory()->create();
	$author = User::factory()->create();
	$quote = Quote::factory()->for($author)->create(['text' => ['en' => 'Hello', 'ka' => 'გამარჯობა']]);

	$response = $this->actingAs($user)->getJson(route('quotes.show', $quote));

	$response->assertOk();
	$response->assertJsonPath('id', $quote->id);
	$response->assertJsonPath('text.en', 'Hello');
	$response->assertJsonPath('is_liked_by_me', false);
});

test('guests cannot add a quote', function () {
	$movie = Movie::factory()->create();

	$this->post(route('quotes.store'), ['movie_id' => $movie->id])->assertForbidden();
});

test('a signed-in user can add a quote with an image to their own movie', function () {
	Storage::fake('public');

	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();

	$response = $this->actingAs($user)
		->from(route('movies.show', $movie))
		->post(route('quotes.store'), [
			'movie_id' => $movie->id,
			'text'     => ['ka' => 'ციტატა', 'en' => 'A memorable line'],
			'image'    => UploadedFile::fake()->create('quote.jpg', 100, 'image/jpeg'),
		]);

	$response->assertRedirect(route('movies.show', $movie));

	$quote = $movie->quotes()->firstOrFail();
	expect($quote->user_id)->toBe($user->id);
	expect($quote->getTranslation('text', 'en'))->toBe('A memorable line');
	expect($quote->getFirstMediaUrl('image'))->not->toBe('');
});

test('a user cannot add a quote to a movie they do not own', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.store'), [
		'movie_id' => $movie->id,
		'text'     => ['ka' => 'ციტატა', 'en' => 'A memorable line'],
	]);

	$response->assertForbidden();
	expect($movie->quotes()->count())->toBe(0);
});

test('adding a quote redirects back to the page it was added from', function () {
	Storage::fake('public');

	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();

	$response = $this->actingAs($user)
		->from(route('feed'))
		->post(route('quotes.store'), [
			'movie_id' => $movie->id,
			'text'     => ['ka' => 'ციტატა', 'en' => 'A memorable line'],
			'image'    => UploadedFile::fake()->create('quote.jpg', 100, 'image/jpeg'),
		]);

	$response->assertRedirect(route('feed'));
});

test('creating a quote without required fields fails validation', function () {
	$user = User::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.store'), []);

	$response->assertSessionHasErrors(['movie_id', 'text.ka', 'text.en']);
});

test('a quote without its own image falls back to the movie poster', function () {
	Storage::fake('public');

	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();
	$movie->addMedia(UploadedFile::fake()->create('poster.jpg', 100, 'image/jpeg'))->toMediaCollection('poster');

	$response = $this->actingAs($user)
		->from(route('movies.show', $movie))
		->post(route('quotes.store'), [
			'movie_id' => $movie->id,
			'text'     => ['ka' => 'ციტატა', 'en' => 'A memorable line'],
		]);

	$response->assertRedirect(route('movies.show', $movie));

	$quote = $movie->quotes()->firstOrFail();
	expect($quote->getFirstMediaUrl('image'))->toBe('');
	expect($quote->image_url)->toBe($movie->getFirstMediaUrl('poster'));
});

test('creating a quote with mismatched language text fails validation', function () {
	Storage::fake('public');

	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();

	$response = $this->actingAs($user)->post(route('quotes.store'), [
		'movie_id' => $movie->id,
		'text'     => ['ka' => 'A memorable line', 'en' => 'ციტატა'],
		'image'    => UploadedFile::fake()->create('quote.jpg', 100, 'image/jpeg'),
	]);

	$response->assertSessionHasErrors(['text.ka', 'text.en']);
});

test('creating a quote fails validation when the text exceeds 255 characters', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->for($user)->create();

	$response = $this->actingAs($user)->post(route('quotes.store'), [
		'movie_id' => $movie->id,
		'text'     => ['ka' => str_repeat('ა', 256), 'en' => str_repeat('a', 256)],
	]);

	$response->assertSessionHasErrors(['text.ka', 'text.en']);
});

test('guests cannot update a quote', function () {
	$quote = Quote::factory()->create();

	$this->patch(route('quotes.update', $quote), [])->assertForbidden();
});

test('the quote author can update their quote', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->create();
	$quote = Quote::factory()->for($movie)->for($user)->create();

	$response = $this->actingAs($user)->patch(route('quotes.update', $quote), [
		'text' => ['ka' => 'განახლებული', 'en' => 'Updated line'],
	]);

	$response->assertRedirect(route('movies.show', $movie));
	expect($quote->fresh()->getTranslation('text', 'en'))->toBe('Updated line');
});

test('updating a quote fails validation when the text exceeds 255 characters', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->create();
	$quote = Quote::factory()->for($movie)->for($user)->create();

	$response = $this->actingAs($user)->patch(route('quotes.update', $quote), [
		'text' => ['ka' => str_repeat('ა', 256), 'en' => str_repeat('a', 256)],
	]);

	$response->assertSessionHasErrors(['text.ka', 'text.en']);
});

test('a user cannot update a quote they do not own', function () {
	$author = User::factory()->create();
	$otherUser = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$response = $this->actingAs($otherUser)->patch(route('quotes.update', $quote), [
		'text' => ['ka' => 'განახლებული', 'en' => 'Updated line'],
	]);

	$response->assertForbidden();
	expect($quote->fresh()->getTranslation('text', 'en'))->not->toBe('Updated line');
});

test('guests cannot delete a quote', function () {
	$quote = Quote::factory()->create();

	$this->delete(route('quotes.destroy', $quote))->assertForbidden();
});

test('the quote author can delete their quote', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->create();
	$quote = Quote::factory()->for($movie)->for($user)->create();

	$response = $this->actingAs($user)->delete(route('quotes.destroy', $quote));

	$response->assertRedirect(route('movies.show', $movie));
	$this->assertModelMissing($quote);
});

test('a user cannot delete a quote they do not own', function () {
	$author = User::factory()->create();
	$otherUser = User::factory()->create();
	$quote = Quote::factory()->for($author)->create();

	$response = $this->actingAs($otherUser)->delete(route('quotes.destroy', $quote));

	$response->assertForbidden();
	$this->assertModelExists($quote);
});
