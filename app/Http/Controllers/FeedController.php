<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuotePostResource;
use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FeedController extends Controller
{
	public function index(Request $request): Response
	{
		$search = trim((string) $request->query('search', ''));

		return Inertia::render('Feed/Index', [
			'quotes' => Inertia::scroll(
				fn () => Quote::query()
					->with([
						'user',
						'media',
						'movie.media',
						'comments' => fn ($query) => $query->with('user')->latest(),
					])
					->withCount(['likes', 'comments'])
					->withExists(['likes as is_liked_by_me' => fn ($query) => $query->where('user_id', $request->user()->id)])
					->when($search !== '', fn ($query) => $this->applySearch($query, $search))
					->latest()
					->latest('id')
					->paginate(9)
					->through(fn (Quote $quote) => (new QuotePostResource($quote))->resolve($request)),
			),
			'search'       => $search,
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

	private function applySearch(Builder $query, string $search): void
	{
		if (str_starts_with($search, '@')) {
			$query->whereHas('movie', fn ($query) => $query->search(substr($search, 1)));

			return;
		}

		if (str_starts_with($search, '#')) {
			$query->search(substr($search, 1));

			return;
		}

		$query->where(
			fn ($query) => $query
				->whereHas('movie', fn ($query) => $query->search($search))
				->orWhere(fn ($query) => $query->search($search)),
		);
	}
}
