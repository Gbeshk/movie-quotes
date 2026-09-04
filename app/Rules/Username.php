<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Username implements ValidationRule
{
	public function validate(string $attribute, mixed $value, Closure $fail): void
	{
		if (!is_string($value) || !preg_match('/^[a-z0-9]{3,15}$/', $value)) {
			$fail('Must be 3-15 lowercase letters or numbers.');
		}
	}
}
