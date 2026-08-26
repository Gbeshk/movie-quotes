<?php

namespace App\Actions;

use App\Models\Quote;

class GetFeaturedQuotes
{
	/**
	 * @return array<int, array{id: int, text: array<string, string>, movie: array{title: array<string, string>, release_year: int, poster_url: string}}>
	 */
	public function __invoke(): array
	{
		$quotes = Quote::query()
			->whereHas('movie.media', fn ($query) => $query->where('collection_name', 'poster'))
			->with('movie.media')
			->inRandomOrder()
			->limit(3)
			->get();

		return $quotes->map(fn (Quote $quote) => [
			'id'    => $quote->id,
			'text'  => $quote->getTranslations('text'),
			'movie' => [
				'title'        => $quote->movie->getTranslations('title'),
				'release_year' => $quote->movie->release_year,
				'poster_url'   => $quote->movie->getFirstMediaUrl('poster'),
			],
		])->all();
	}
}
