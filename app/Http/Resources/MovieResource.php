<?php

namespace App\Http\Resources;

use App\Models\Movie;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MovieResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		/** @var Movie $movie */
		$movie = $this->resource;

		return [
			'id'           => $movie->id,
			'title'        => $movie->getTranslations('title'),
			'release_year' => $movie->release_year,
			'poster_url'   => $movie->poster_url,
		];
	}
}
