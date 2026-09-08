<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class GeorgianText implements ValidationRule
{
	public function validate(string $attribute, mixed $value, Closure $fail): void
	{
		if (!is_string($value) || !preg_match('/^[^a-zA-Z]*$/u', $value)) {
			$fail('Must contain only Georgian characters.');
		}
	}
}
