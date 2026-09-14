<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
	/**
	 * Redirect to the welcome page, where the reset-password modal opens itself.
	 */
	public function create(Request $request): RedirectResponse
	{
		$token = $request->route('token');
		$email = $request->email;

		$user = User::where('email', $email)->first();
		$tokenValid = $user !== null && Password::tokenExists($user, $token);

		$params = [
			'reset_token' => $token,
			'reset_email' => $email,
		];

		if (!$tokenValid) {
			$params['reset_expired'] = 1;
		}

		return redirect()->route('welcome', $params);
	}

	/**
	 * Handle an incoming new password request.
	 *
	 * @throws ValidationException
	 */
	public function store(Request $request): RedirectResponse
	{
		$request->validate([
			'token'    => 'required',
			'email'    => 'required|email',
			'password' => ['required', 'confirmed', Rules\Password::defaults()],
		]);

		$status = Password::reset(
			$request->only('email', 'password', 'password_confirmation', 'token'),
			function ($user) use ($request) {
				$user->forceFill([
					'password'       => Hash::make($request->password),
					'remember_token' => Str::random(60),
				])->save();

				event(new PasswordReset($user));
			}
		);

		if ($status == Password::PASSWORD_RESET) {
			return redirect()->route('welcome')->with('status', __($status));
		}

		throw ValidationException::withMessages([
			'email' => [trans($status)],
		]);
	}
}
