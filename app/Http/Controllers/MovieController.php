<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMovieRequest;
use App\Http\Requests\UpdateMovieRequest;
use App\Models\Movie;
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
		$movies = Movie::query()
			->where('user_id', $request->user()->id)
			->withCount('quotes')
			->latest()
			->get();

		return Inertia::render('Movies/Index', [
			'movies' => $movies,
		]);
	}

	public function show(Movie $movie): Response
	{
		$movie->load(['quotes.user', 'user']);

		return Inertia::render('Movies/Show', [
			'movie' => $movie,
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
