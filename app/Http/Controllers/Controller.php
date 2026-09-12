<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

abstract class Controller
{
	protected function redirectToFeedOr(?string $redirectTo, string $fallbackRoute, mixed ...$fallbackParameters): RedirectResponse
	{
		return $redirectTo === 'feed'
			? Redirect::route('feed')
			: Redirect::route($fallbackRoute, ...$fallbackParameters);
	}
}
