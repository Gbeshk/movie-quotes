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
		return Inertia::render('Welcome', [
			'canLogin'       => Route::has('login'),
			'canRegister'    => Route::has('register'),
			'laravelVersion' => Application::VERSION,
			'phpVersion'     => PHP_VERSION,
			'quotes'         => $getFeaturedQuotes(),
		]);
	}
}
