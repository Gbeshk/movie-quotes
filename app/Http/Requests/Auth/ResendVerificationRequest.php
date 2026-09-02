<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ResendVerificationRequest extends FormRequest
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
			'email'    => ['required', 'string', 'email'],
			'password' => ['required', 'string'],
		];
	}

	/**
	 * Verify the request's credentials without starting a session.
	 *
	 * @throws ValidationException
	 */
	public function authenticate(): void
	{
		if (!Auth::once($this->only('email', 'password'))) {
			throw ValidationException::withMessages([
				'verification' => trans('auth.failed'),
			]);
		}
	}
}
