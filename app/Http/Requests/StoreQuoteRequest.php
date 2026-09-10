<?php

namespace App\Http\Requests;

use App\Rules\EnglishText;
use App\Rules\GeorgianText;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'text.ka' => ['required', 'string', new GeorgianText()],
			'text.en' => ['required', 'string', new EnglishText()],
			'image'   => ['required', 'image', 'max:4096'],
		];
	}
}
