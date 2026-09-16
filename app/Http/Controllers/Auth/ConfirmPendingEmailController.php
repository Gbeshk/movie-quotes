<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ConfirmPendingEmailController extends Controller
{
	public function __invoke(Request $request, User $user): RedirectResponse
	{
		abort_unless($request->user()->is($user), 403);

		if ($user->pending_email === null) {
			return redirect()->route('profile.edit');
		}

		$user->forceFill([
			'email'             => $user->pending_email,
			'pending_email'     => null,
			'email_verified_at' => now(),
		])->save();

		return redirect()->route('profile.edit')->with('status', 'email-confirmed');
	}
}
