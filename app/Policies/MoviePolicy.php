<?php

namespace App\Policies;

use App\Models\Movie;
use App\Models\User;

class MoviePolicy
{
	/**
	 * Only the movie's owner can edit it.
	 */
	public function update(User $user, Movie $movie): bool
	{
		return $user->id === $movie->user_id;
	}

	/**
	 * Only the movie's owner can delete it.
	 */
	public function delete(User $user, Movie $movie): bool
	{
		return $user->id === $movie->user_id;
	}
}
