<?php

namespace App\Services;

use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class WelcomeQuoteSelector
{
	private const SESSION_KEY = 'welcome_quote_ids';

	public function select(Request $request): Collection
	{
		$quotes = $this->rememberedQuotes($request);

		if ($quotes->count() >= 3) {
			return $quotes;
		}

		$quotes = $this->randomQuotes();

		if ($quotes->count() >= 3) {
			$request->session()->put(self::SESSION_KEY, $quotes->pluck('id')->all());
		} else {
			$request->session()->forget(self::SESSION_KEY);
		}

		return $quotes;
	}

	private function rememberedQuotes(Request $request): Collection
	{
		$ids = $request->session()->get(self::SESSION_KEY, []);

		if ($ids === []) {
			return new Collection();
		}

		return Quote::query()
			->whereIn('id', $ids)
			->with(['media', 'movie.media'])
			->get()
			->sortBy(fn (Quote $quote) => array_search($quote->id, $ids))
			->values();
	}

	private function randomQuotes(): Collection
	{
		$movieIds = Movie::query()
			->whereHas('media', fn ($query) => $query->where('collection_name', 'poster'))
			->whereHas('quotes')
			->inRandomOrder()
			->limit(3)
			->pluck('id');

		return Quote::query()
			->whereIn('movie_id', $movieIds)
			->with(['media', 'movie.media'])
			->inRandomOrder()
			->get()
			->unique('movie_id');
	}
}
