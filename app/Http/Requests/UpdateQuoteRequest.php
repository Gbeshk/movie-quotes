<?php

namespace App\Http\Requests;

use App\Rules\EnglishText;
use App\Rules\GeorgianText;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateQuoteRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return $this->user()->can('update', $this->route('quote'));
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		return [
			'text.ka' => ['required', 'string', new GeorgianText()],
			'text.en' => ['required', 'string', new EnglishText()],
			'image'   => ['nullable', 'image', 'max:4096'],
		];
	}
}
