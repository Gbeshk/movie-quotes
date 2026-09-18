<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
	->withRouting(
		channels: __DIR__ . '/../routes/channels.php',
		web: __DIR__ . '/../routes/web.php',
		commands: __DIR__ . '/../routes/console.php',
		health: '/up',
	)
	->withMiddleware(function (Middleware $middleware): void {
		$middleware->web(append: [
			\App\Http\Middleware\HandleInertiaRequests::class,
			\Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
		]);
	})
	->withExceptions(function (Exceptions $exceptions): void {
		$exceptions->shouldRenderJsonWhen(
			fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
		);

		$exceptions->render(function (\Illuminate\Auth\AuthenticationException $exception, Request $request) {
			if ($request->expectsJson() || $request->is('api/*')) {
				return null;
			}

			return response('', 403);
		});

		$exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
			if ($request->expectsJson() || $request->is('api/*')) {
				return $response;
			}

			$page = match ($response->getStatusCode()) {
				403     => 'Error/Forbidden',
				404     => 'Error/NotFound',
				default => null,
			};

			if ($page === null) {
				return $response;
			}

			return Inertia::render($page)->toResponse($request)->setStatusCode($response->getStatusCode());
		});
	})->create();
