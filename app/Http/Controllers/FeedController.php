<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
	public function index(): Response
	{
		return Inertia::render('Feed/Index', [
			'quotes' => Inertia::scroll(
				fn () => Quote::query()
					->with([
						'user',
						'media',
						'movie.media',
						'comments' => fn ($query) => $query->with('user')->oldest(),
					])
					->withCount(['likes', 'comments'])
					->latest()
					->latest('id')
					->paginate(9),
			),
		]);
	}
}
