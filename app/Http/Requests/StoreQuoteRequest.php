<?php

namespace App\Http\Requests;

use App\Models\Quote;
use App\Rules\EnglishText;
use App\Rules\GeorgianText;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
	public function authorize(): bool
	{
		return $this->user()->can('create', Quote::class);
	}

	public function rules(): array
	{
		return [
			'movie_id'    => ['required', 'integer', 'exists:movies,id'],
			'text.ka'     => ['required', 'string', new GeorgianText()],
			'text.en'     => ['required', 'string', new EnglishText()],
			'image'       => ['nullable', 'image', 'max:4096'],
			'redirect_to' => ['nullable', 'in:feed'],
		];
	}
}
