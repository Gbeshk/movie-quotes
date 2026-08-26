<?php

namespace App\Http\Controllers;

use App\Actions\GetFeaturedQuotes;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
	public function index(GetFeaturedQuotes $getFeaturedQuotes): Response
	{
		$quotes = $getFeaturedQuotes();

		if (count($quotes) < 3) {
			$quotes = collect(config('welcome.fallback_quotes'))
				->map(fn (array $quote) => [
					'id'    => $quote['id'],
					'text'  => $quote['text'],
					'movie' => [
						'title'        => $quote['movie']['title'],
						'release_year' => $quote['movie']['release_year'],
						'poster_url'   => asset($quote['movie']['poster']),
					],
				])
				->all();
		}

		return Inertia::render('Welcome', [
			'canLogin'       => Route::has('login'),
			'canRegister'    => Route::has('register'),
			'laravelVersion' => Application::VERSION,
			'phpVersion'     => PHP_VERSION,
			'quotes'         => $quotes,
		]);
	}
}
