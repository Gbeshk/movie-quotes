<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\UpdateAvatarRequest;
use App\Notifications\ConfirmPendingEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
	public function edit(): Response
	{
		return Inertia::render('Profile/Edit');
	}

	public function update(ProfileUpdateRequest $request): RedirectResponse
	{
		$user = $request->user();

		$user->fill(['username' => $request->validated('username')]);

		$newEmail = $request->validated('email');

		if ($newEmail === $user->email) {
			$user->pending_email = null;
		} else {
			$user->pending_email = $newEmail;
		}

		$user->save();

		if ($user->pending_email !== null) {
			Notification::route('mail', $user->pending_email)->notify(new ConfirmPendingEmail($user));
		}

		return Redirect::route('profile.edit');
	}

	public function updateAvatar(UpdateAvatarRequest $request): RedirectResponse
	{
		$request->user()->addMediaFromRequest('avatar')->toMediaCollection('avatar');

		return Redirect::route('profile.edit');
	}

	public function destroy(Request $request): RedirectResponse
	{
		$request->validate([
			'password' => ['required', 'current_password'],
		]);

		$user = $request->user();

		Auth::logout();

		$user->delete();

		$request->session()->invalidate();
		$request->session()->regenerateToken();

		return Redirect::to('/');
	}
}
