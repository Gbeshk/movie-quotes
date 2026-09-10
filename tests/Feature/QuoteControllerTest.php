<?php

use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

test('guests cannot add a quote', function () {
	$movie = Movie::factory()->create();

	$this->post(route('quotes.store', $movie), [])->assertRedirect(route('login'));
});

test('a signed-in user can add a quote with an image to any movie', function () {
	Storage::fake('public');

	$user = User::factory()->create();
	$movie = Movie::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.store', $movie), [
		'text'  => ['ka' => 'ციტატა', 'en' => 'A memorable line'],
		'image' => UploadedFile::fake()->create('quote.jpg', 100, 'image/jpeg'),
	]);

	$response->assertRedirect(route('movies.show', $movie));

	$quote = $movie->quotes()->firstOrFail();
	expect($quote->user_id)->toBe($user->id);
	expect($quote->getTranslation('text', 'en'))->toBe('A memorable line');
	expect($quote->getFirstMediaUrl('image'))->not->toBe('');
});

test('creating a quote without required fields fails validation', function () {
	$user = User::factory()->create();
	$movie = Movie::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.store', $movie), []);

	$response->assertSessionHasErrors(['text.ka', 'text.en', 'image']);
});

test('creating a quote with mismatched language text fails validation', function () {
	Storage::fake('public');

	$user = User::factory()->create();
	$movie = Movie::factory()->create();

	$response = $this->actingAs($user)->post(route('quotes.store', $movie), [
		'text'  => ['ka' => 'A memorable line', 'en' => 'ციტატა'],
		'image' => UploadedFile::fake()->create('quote.jpg', 100, 'image/jpeg'),
	]);

	$response->assertSessionHasErrors(['text.ka', 'text.en']);
});

test('guests cannot update a quote', function () {
	$quote = Quote::factory()->create();

	$this->patch(route('quotes.update', $quote), [])->assertRedirect(route('login'));
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

	$this->delete(route('quotes.destroy', $quote))->assertRedirect(route('login'));
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
