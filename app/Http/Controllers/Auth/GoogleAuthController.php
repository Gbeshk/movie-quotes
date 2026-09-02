<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class GoogleAuthController extends Controller
{
	public function redirect(): RedirectResponse
	{
		return Socialite::driver('google')->redirect();
	}

	public function callback(): RedirectResponse
	{
		try {
			$googleUser = Socialite::driver('google')->user();
		} catch (Throwable) {
			return redirect()->route('welcome')->with('error', 'Unable to sign in with Google. Please try again.');
		}

		$user = User::firstWhere('google_id', $googleUser->getId())
			?? User::firstWhere('email', $googleUser->getEmail());

		if ($user) {
			$user->fill(['google_id' => $googleUser->getId()])->save();
		} else {
			$user = User::create([
				'username'  => $this->uniqueUsername($googleUser->getName() ?: $googleUser->getEmail()),
				'email'     => $googleUser->getEmail(),
				'google_id' => $googleUser->getId(),
				'password'  => null,
			]);
		}

		if (!$user->hasVerifiedEmail()) {
			$user->markEmailAsVerified();
		}

		Auth::login($user);

		return redirect()->route('welcome');
	}

	private function uniqueUsername(string $source): string
	{
		$base = Str::of($source)->lower()->replaceMatches('/[^a-z0-9]/', '')->substr(0, 15)->value();
		$base = $base !== '' ? $base : 'user';

		$username = $base;
		$suffix = 1;

		while (User::where('username', $username)->exists()) {
			$suffixValue = (string) $suffix;
			$username = Str::substr($base, 0, 15 - strlen($suffixValue)) . $suffixValue;
			$suffix++;
		}

		return $username;
	}
}
