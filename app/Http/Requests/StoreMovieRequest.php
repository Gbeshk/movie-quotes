<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMovieRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		return [
			'title.ka'       => ['required', 'string', 'max:255'],
			'title.en'       => ['required', 'string', 'max:255'],
			'director.ka'    => ['required', 'string', 'max:255'],
			'director.en'    => ['required', 'string', 'max:255'],
			'genre'          => ['required', 'string', 'max:255'],
			'release_year'   => ['required', 'integer', 'min:1888', 'max:' . (int) date('Y')],
			'description.ka' => ['required', 'string'],
			'description.en' => ['required', 'string'],
			'poster'         => ['required', 'image', 'max:4096'],
		];
	}
}
