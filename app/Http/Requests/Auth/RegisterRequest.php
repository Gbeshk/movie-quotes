<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
			'username' => [...User::usernameFormatRules(), 'unique:' . User::class],
			'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
			'password' => ['required', 'string', 'min:8', 'max:15', 'regex:/^[a-z0-9]+$/', 'confirmed'],
		];
	}

	/**
	 * Get the custom validation messages for the defined rules.
	 *
	 * @return array<string, string>
	 */
	public function messages(): array
	{
		return [
			...User::usernameFormatMessages(),
			'password.min'   => 'Must be 8-15 lowercase letters or numbers.',
			'password.max'   => 'Must be 8-15 lowercase letters or numbers.',
			'password.regex' => 'Must be 8-15 lowercase letters or numbers.',
		];
	}
}
