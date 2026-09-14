<?php

namespace App\Http\Requests;

use App\Models\Movie;
use App\Models\Quote;
use App\Rules\EnglishText;
use App\Rules\GeorgianText;
use Illuminate\Foundation\Http\FormRequest;

class StoreQuoteRequest extends FormRequest
{
	public function authorize(): bool
	{
		$movie = Movie::find($this->input('movie_id'));

		return $movie === null || $this->user()->can('create', [Quote::class, $movie]);
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
