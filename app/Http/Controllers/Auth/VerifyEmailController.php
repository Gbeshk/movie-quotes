<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
	public function __invoke(Request $request): RedirectResponse
	{
		$user = User::findOrFail($request->route('id'));

		abort_unless(
			hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification())),
			403
		);

		if (!$user->hasVerifiedEmail() && $user->markEmailAsVerified()) {
			event(new Verified($user));
		}

		if (!Auth::check()) {
			Auth::login($user);
		}

		return redirect()->route('welcome', ['verified' => 1]);
	}
}
