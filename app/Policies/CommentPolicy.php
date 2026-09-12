<?php

namespace App\Policies;

use App\Models\User;

class CommentPolicy
{
	public function create(User $user): bool
	{
		return true;
	}
}
