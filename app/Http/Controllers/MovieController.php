<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMovieRequest;
use App\Http\Requests\UpdateMovieRequest;
use App\Http\Resources\QuotePostResource;
use App\Models\Movie;
use App\Models\Quote;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class MovieController extends Controller
{
	use AuthorizesRequests;

	public function index(Request $request): Response
	{
		$search = trim((string) $request->query('search', ''));

		$query = fn () => Movie::query()
			->where('user_id', auth()->id())
			->when(
				str_starts_with($search, '#'),
				fn ($query) => $query->whereHas('quotes', fn ($query) => $query->search(substr($search, 1))),
				fn ($query) => $query->search(str_starts_with($search, '@') ? substr($search, 1) : $search),
			);

		return Inertia::render('Movies/Index', [
			'movies' => Inertia::scroll(
				fn () => $query()->with('media')->withCount('quotes')->latest()->latest('id')->paginate(9),
			),
			'moviesCount' => $query()->count(),
			'search'      => $search,
		]);
	}

	public function show(Movie $movie, Request $request): Response
	{
		$movie->load(['user', 'media']);

		$quotesQuery = fn () => $movie->quotes()
			->with([
				'user',
				'media',
				'movie.media',
				'comments' => fn ($query) => $query->with('user')->latest(),
			])
			->withCount(['likes', 'comments'])
			->withExists(['likes as is_liked_by_me' => fn ($query) => $query->where('user_id', $request->user()->id)]);

		return Inertia::render('Movies/Show', [
			'movie' => [
				'id'           => $movie->id,
				'user_id'      => $movie->user_id,
				'title'        => $movie->getTranslations('title'),
				'director'     => $movie->getTranslations('director'),
				'genre'        => $movie->genre,
				'release_year' => $movie->release_year,
				'description'  => $movie->getTranslations('description'),
				'poster_url'   => $movie->poster_url,
				'user'         => $movie->user,
			],
			'quotes' => Inertia::scroll(
				fn () => $quotesQuery()
					->latest()
					->latest('id')
					->paginate(9)
					->through(fn (Quote $quote) => (new QuotePostResource($quote))->resolve($request)),
			),
			'quotesCount' => $quotesQuery()->count(),
		]);
	}

	public function store(StoreMovieRequest $request): RedirectResponse
	{
		$movie = Movie::create([
			...$request->safe()->except('poster'),
			'user_id' => $request->user()->id,
		]);

		$movie->addMediaFromRequest('poster')->toMediaCollection('poster');

		return Redirect::route('movies.index');
	}

	public function update(UpdateMovieRequest $request, Movie $movie): RedirectResponse
	{
		$this->authorize('update', $movie);

		$movie->update($request->safe()->except('poster'));

		if ($request->hasFile('poster')) {
			$movie->addMediaFromRequest('poster')->toMediaCollection('poster');
		}

		return Redirect::route('movies.show', $movie);
	}

	public function destroy(Movie $movie): RedirectResponse
	{
		$this->authorize('delete', $movie);

		$movie->delete();

		return Redirect::route('movies.index');
	}
}
