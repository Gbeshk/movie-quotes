<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class EmailVerificationNotificationController extends Controller
{
	/**
	 * Send a new email verification notification.
	 */
	public function store(Request $request): RedirectResponse
	{
		if ($request->user()->hasVerifiedEmail()) {
			return redirect()->intended(route('dashboard', absolute: false));
		}

		$request->user()->sendEmailVerificationNotification();

		return back()->with('status', 'verification-link-sent');
	}

	/**
	 * Re-send the verification notification for a guest who failed login
	 * because their account is not verified yet.
	 */
	public function resend(Request $request): RedirectResponse
	{
		$request->validate([
			'email'    => ['required', 'string', 'email'],
			'password' => ['required', 'string'],
		]);

		if (!Auth::once($request->only('email', 'password'))) {
			throw ValidationException::withMessages([
				'verification' => trans('auth.failed'),
			]);
		}

		if (!Auth::user()->hasVerifiedEmail()) {
			Auth::user()->sendEmailVerificationNotification();
		}

		return back()->with('status', 'verification-link-sent');
	}
}
