<?php

namespace App\Policies;

use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;

class QuotePolicy
{
	public function create(User $user, Movie $movie): bool
	{
		return $user->id === $movie->user_id;
	}

	public function update(User $user, Quote $quote): bool
	{
		return $user->id === $quote->user_id;
	}

	public function delete(User $user, Quote $quote): bool
	{
		return $user->id === $quote->user_id;
	}
}
