<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
	public function toArray(Request $request): array
	{
		/** @var User $user */
		$user = $this->resource;

		return [
			'id'                => $user->id,
			'username'          => $user->username,
			'email'             => $user->email,
			'pending_email'     => $user->pending_email,
			'email_verified_at' => $user->email_verified_at,
			'avatar_url'        => $user->avatar_url,
			'google_id'         => $user->google_id,
		];
	}
}
