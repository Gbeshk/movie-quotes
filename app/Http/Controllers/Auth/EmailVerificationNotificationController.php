<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResendVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailVerificationNotificationController extends Controller
{
	public function store(Request $request): RedirectResponse
	{
		if ($request->user()->hasVerifiedEmail()) {
			return redirect()->intended(route('feed', absolute: false));
		}

		$request->user()->sendEmailVerificationNotification();

		return back()->with('status', 'verification-link-sent');
	}

	public function resend(ResendVerificationRequest $request): RedirectResponse
	{
		$request->authenticate();

		if (!Auth::user()->hasVerifiedEmail()) {
			Auth::user()->sendEmailVerificationNotification();
		}

		return back()->with('status', 'verification-link-sent');
	}
}
