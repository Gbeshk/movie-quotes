<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuoteResource;
use App\Models\Quote;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
	public function index(): Response
	{
		$quotes = Quote::query()
			->whereHas('movie.media', fn ($query) => $query->where('collection_name', 'poster'))
			->with('movie.media')
			->inRandomOrder()
			->limit(3)
			->get();

		if ($quotes->count() < 3) {
			$quotes = config('welcome.fallback_quotes');
		}

		return Inertia::render('Welcome', [
			'quotes' => QuoteResource::collection($quotes),
		]);
	}
}
