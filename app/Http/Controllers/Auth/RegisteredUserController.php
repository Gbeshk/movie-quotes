<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
	/**
	 * Handle an incoming registration request.
	 *
	 * @throws ValidationException
	 */
	public function store(RegisterRequest $request): RedirectResponse
	{
		$user = User::create([
			'username' => $request->username,
			'email'    => $request->email,
			'password' => Hash::make($request->password),
		]);

		event(new Registered($user));

		throw ValidationException::withMessages([
			'verification' => 'Your account is not verified yet. Please check your email or resend the verification link.',
		]);
	}
}
