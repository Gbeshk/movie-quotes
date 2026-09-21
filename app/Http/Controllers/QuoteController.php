<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuoteRequest;
use App\Http\Requests\UpdateQuoteRequest;
use App\Http\Resources\QuotePostResource;
use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class QuoteController extends Controller
{
	use AuthorizesRequests;

	public function show(Quote $quote, Request $request): JsonResponse
	{
		$quote = Quote::query()
			->forPost($request->user()->id)
			->findOrFail($quote->id);

		return response()->json((new QuotePostResource($quote))->resolve($request));
	}

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

		return back();
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
