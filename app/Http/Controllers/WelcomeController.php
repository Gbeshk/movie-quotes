<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuoteResource;
use App\Models\Movie;
use App\Models\Quote;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
	public function index(): Response
	{
		$movieIds = Movie::query()
			->whereHas('media', fn ($query) => $query->where('collection_name', 'poster'))
			->whereHas('quotes')
			->inRandomOrder()
			->limit(3)
			->pluck('id');

		$quotes = Quote::query()
			->whereIn('movie_id', $movieIds)
			->with(['media', 'movie.media'])
			->inRandomOrder()
			->get()
			->unique('movie_id');

		if ($quotes->count() < 3) {
			$quotes = config('welcome.fallback_quotes');
		}

		return Inertia::render('Welcome', [
			'quotes' => QuoteResource::collection($quotes),
		]);
	}
}
