<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ToggleLikeRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'quote_id'    => ['required', 'integer', 'exists:quotes,id'],
			'redirect_to' => ['nullable', 'in:feed'],
		];
	}
}
