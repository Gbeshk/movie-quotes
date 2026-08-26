<?php

namespace App\Http\Resources;

use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
	/**
	 * @return array{id: int|string, text: array<string, string>, movie: array{title: array<string, string>, release_year: int, poster_url: string}}
	 */
	public function toArray(Request $request): array
	{
		return $this->resource instanceof Quote
			? $this->fromQuote($this->resource)
			: $this->fromConfig($this->resource);
	}

	/**
	 * @return array{id: int, text: array<string, string>, movie: array{title: array<string, string>, release_year: int, poster_url: string}}
	 */
	private function fromQuote(Quote $quote): array
	{
		return [
			'id'    => $quote->id,
			'text'  => $quote->getTranslations('text'),
			'movie' => [
				'title'        => $quote->movie->getTranslations('title'),
				'release_year' => $quote->movie->release_year,
				'poster_url'   => $quote->movie->getFirstMediaUrl('poster'),
			],
		];
	}

	/**
	 * @param array{id: string, text: array<string, string>, movie: array{title: array<string, string>, release_year: int, poster: string}} $quote
	 *
	 * @return array{id: string, text: array<string, string>, movie: array{title: array<string, string>, release_year: int, poster_url: string}}
	 */
	private function fromConfig(array $quote): array
	{
		return [
			'id'    => $quote['id'],
			'text'  => $quote['text'],
			'movie' => [
				'title'        => $quote['movie']['title'],
				'release_year' => $quote['movie']['release_year'],
				'poster_url'   => asset($quote['movie']['poster']),
			],
		];
	}
}
