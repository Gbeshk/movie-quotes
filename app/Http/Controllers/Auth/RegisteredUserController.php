<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
	/**
	 * Handle an incoming registration request.
	 *
	 * @throws ValidationException
	 */
	public function store(Request $request): RedirectResponse
	{
		$request->validate([
			'username' => ['required', 'string', 'min:3', 'max:15', 'regex:/^[a-z0-9]+$/', 'unique:' . User::class],
			'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
			'password' => ['required', 'string', 'min:8', 'max:15', 'regex:/^[a-z0-9]+$/', 'confirmed'],
		], [
			'username.min'   => 'Must be 3-15 lowercase letters or numbers.',
			'username.max'   => 'Must be 3-15 lowercase letters or numbers.',
			'username.regex' => 'Must be 3-15 lowercase letters or numbers.',
			'password.min'   => 'Must be 8-15 lowercase letters or numbers.',
			'password.max'   => 'Must be 8-15 lowercase letters or numbers.',
			'password.regex' => 'Must be 8-15 lowercase letters or numbers.',
		]);

		$user = User::create([
			'username' => $request->username,
			'email'    => $request->email,
			'password' => Hash::make($request->password),
		]);

		event(new Registered($user));

		Auth::login($user);

		return redirect(route('welcome', absolute: false));
	}
}
