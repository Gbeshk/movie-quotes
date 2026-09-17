<?php

namespace App\Http\Resources;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		/** @var Comment $comment */
		$comment = $this->resource;

		return [
			'id'   => $comment->id,
			'body' => $comment->body,
			'user' => UserResource::make($comment->user),
		];
	}
}
