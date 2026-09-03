<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
	public function index(): Response
	{
		$movies = Movie::query()
			->with('user')
			->withCount('quotes')
			->latest()
			->get();

		return Inertia::render('Feed/Index', [
			'movies' => $movies,
		]);
	}
}
