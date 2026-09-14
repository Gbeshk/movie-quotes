<?php

namespace App\Http\Middleware;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Middleware;

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
			'notifications'            => $this->notifications($request),
		];
	}

	/**
	 * @return Collection<int, DatabaseNotification>
	 */
	protected function notifications(Request $request): Collection
	{
		return $request->user()
			?->notifications()
			->latest()
			->limit(20)
			->get(['id', 'data', 'read_at', 'created_at']) ?? new Collection();
	}
}
