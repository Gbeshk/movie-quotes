<?php

namespace App\Http\Resources;

use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		return $this->resource instanceof Quote
			? $this->fromQuote($this->resource)
			: $this->fromConfig($this->resource);
	}

	private function fromQuote(Quote $quote): array
	{
		return [
			'id'        => $quote->id,
			'text'      => $quote->getTranslations('text'),
			'image_url' => $quote->getFirstMediaUrl('image'),
			'movie'     => [
				'title'        => $quote->movie->getTranslations('title'),
				'release_year' => $quote->movie->release_year,
				'poster_url'   => $quote->movie->getFirstMediaUrl('poster'),
			],
		];
	}

	private function fromConfig(array $quote): array
	{
		return [
			'id'        => $quote['id'],
			'text'      => $quote['text'],
			'image_url' => asset($quote['image']),
			'movie'     => [
				'title'        => $quote['movie']['title'],
				'release_year' => $quote['movie']['release_year'],
				'poster_url'   => asset($quote['movie']['poster']),
			],
		];
	}
}
