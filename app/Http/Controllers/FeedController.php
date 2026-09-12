<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
	public function index(Request $request): Response
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
					->withExists(['likes as is_liked_by_me' => fn ($query) => $query->where('user_id', $request->user()->id)])
					->latest()
					->latest('id')
					->paginate(9),
			),
			'movieOptions' => Inertia::optional(
				fn () => Movie::query()
					->where('user_id', $request->user()->id)
					->search($request->query('movie_search'))
					->with('media')
					->latest()
					->limit(10)
					->get(['id', 'title', 'director', 'genre', 'release_year']),
			),
		]);
	}
}
