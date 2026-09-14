<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuoteRequest;
use App\Http\Requests\UpdateQuoteRequest;
use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class QuoteController extends Controller
{
	use AuthorizesRequests;

	public function store(StoreQuoteRequest $request): RedirectResponse
	{
		$movie = Movie::findOrFail($request->validated('movie_id'));

		$quote = $movie->quotes()->create([
			...$request->safe()->except(['image', 'movie_id']),
			'user_id' => $request->user()->id,
		]);

		if ($request->hasFile('image')) {
			$quote->addMediaFromRequest('image')->toMediaCollection('image');
		}

		return $quote->shouldRedirectToFeed($request->validated('redirect_to'))
			? Redirect::route('feed')
			: Redirect::route('movies.show', $quote->movie_id);
	}

	public function update(UpdateQuoteRequest $request, Quote $quote): RedirectResponse
	{
		$this->authorize('update', $quote);

		$quote->update($request->safe()->except('image'));

		if ($request->hasFile('image')) {
			$quote->addMediaFromRequest('image')->toMediaCollection('image');
		}

		return Redirect::route('movies.show', $quote->movie_id);
	}

	public function destroy(Quote $quote): RedirectResponse
	{
		$this->authorize('delete', $quote);

		$movieId = $quote->movie_id;

		$quote->delete();

		return Redirect::route('movies.show', $movieId);
	}
}
