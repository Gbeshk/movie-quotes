<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectVerifiedUsersToFeed
{
	public function handle(Request $request, Closure $next): Response
	{
		if ($request->user()?->hasVerifiedEmail() && !$request->hasAny(['reset_token', 'verified'])) {
			return redirect()->route('feed');
		}

		return $next($request);
	}
}
