<?php

namespace App\Http\Requests;

use App\Rules\EnglishText;
use App\Rules\GeorgianText;
use Illuminate\Foundation\Http\FormRequest;

class UpdateQuoteRequest extends FormRequest
{
	public function authorize(): bool
	{
		return $this->user()->can('update', $this->route('quote'));
	}

	public function rules(): array
	{
		return [
			'text.ka' => ['required', 'string', new GeorgianText()],
			'text.en' => ['required', 'string', new EnglishText()],
			'image'   => ['nullable', 'image', 'max:4096'],
		];
	}
}
