<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;
use Inertia\ScrollProp;

class HandleInertiaRequests extends Middleware
{
	/**
	 * The root template that is loaded on the first page visit.
	 *
	 * @var string
	 */
	protected $rootView = 'app';

	/**
	 * Determine the current asset version.
	 */
	public function version(Request $request): ?string
	{
		return parent::version($request);
	}

	/**
	 * Define the props that are shared by default.
	 *
	 * @return array<string, mixed>
	 */
	public function share(Request $request): array
	{
		return [
			...parent::share($request),
			'auth' => [
				'user' => $request->user(),
			],
			'unreadNotificationsCount' => $request->user()?->unreadNotifications()->count() ?? 0,
			'notifications'            => $request->user() ? $this->notifications($request) : null,
		];
	}

	protected function notifications(Request $request): ScrollProp
	{
		return Inertia::scroll(
			fn () => $request->user()
				->notifications()
				->latest()
				->paginate(perPage: 20, columns: ['id', 'data', 'read_at', 'created_at'], pageName: 'notifications_page'),
		);
	}
}
