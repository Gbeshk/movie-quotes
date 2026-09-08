<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class EnglishText implements ValidationRule
{
	public function validate(string $attribute, mixed $value, Closure $fail): void
	{
		if (!is_string($value) || !preg_match('/^[^\x{10A0}-\x{10FF}]*$/u', $value)) {
			$fail('Must contain only English characters.');
		}
	}
}
