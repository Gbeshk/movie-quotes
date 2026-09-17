<?php

namespace App\Http\Resources;

use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuotePostResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		/** @var Quote $quote */
		$quote = $this->resource;

		return [
			'id'             => $quote->id,
			'movie_id'       => $quote->movie_id,
			'user_id'        => $quote->user_id,
			'text'           => $quote->getTranslations('text'),
			'image_url'      => $quote->image_url,
			'likes_count'    => $quote->likes_count,
			'comments_count' => $quote->comments_count,
			'is_liked_by_me' => $quote->is_liked_by_me,
			'user'           => UserResource::make($quote->user),
			'movie'          => $quote->movie ? MovieResource::make($quote->movie) : null,
			'comments'       => CommentResource::collection($quote->comments),
		];
	}
}
