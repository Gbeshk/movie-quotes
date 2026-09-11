<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMovieRequest;
use App\Http\Requests\UpdateMovieRequest;
use App\Models\Movie;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
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
			->search($search);

		return Inertia::render('Movies/Index', [
			'movies' => Inertia::scroll(
				fn () => $query()->with('media')->withCount('quotes')->latest()->latest('id')->paginate(9),
			),
			'moviesCount' => $query()->count(),
			'search'      => $search,
		]);
	}

	public function search(Request $request): JsonResponse
	{
		$search = trim((string) $request->query('q', ''));

		$movies = Movie::query()
			->search($search)
			->with('media')
			->latest()
			->limit(10)
			->get(['id', 'title', 'director', 'genre', 'release_year']);

		return response()->json($movies);
	}

	public function show(Movie $movie): Response
	{
		$movie->load(['user', 'media']);

		$quotesQuery = fn () => $movie->quotes()->with(['user', 'media', 'movie.media'])->withCount(['likes', 'comments']);

		return Inertia::render('Movies/Show', [
			'movie'  => $movie,
			'quotes' => Inertia::scroll(
				fn () => $quotesQuery()->latest()->latest('id')->paginate(9),
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
