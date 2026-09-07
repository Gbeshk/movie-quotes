<?php

namespace App\Http\Requests;

use App\Rules\EnglishText;
use App\Rules\GeorgianText;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMovieRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return $this->user()->can('update', $this->route('movie'));
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		return [
			'title.ka'       => ['required', 'string', 'max:255', new GeorgianText()],
			'title.en'       => ['required', 'string', 'max:255', new EnglishText()],
			'director.ka'    => ['required', 'string', 'max:255', new GeorgianText()],
			'director.en'    => ['required', 'string', 'max:255', new EnglishText()],
			'genre'          => ['required', 'array', 'min:1'],
			'genre.*'        => ['string', 'max:255', new EnglishText()],
			'release_year'   => ['required', 'integer', 'min:1888', 'max:' . (int) date('Y')],
			'description.ka' => ['required', 'string', new GeorgianText()],
			'description.en' => ['required', 'string', new EnglishText()],
			'poster'         => ['nullable', 'image', 'max:4096'],
		];
	}
}
