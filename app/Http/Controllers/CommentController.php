<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Quote;
use App\Notifications\QuoteCommented;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class CommentController extends Controller
{
	public function store(StoreCommentRequest $request, Quote $quote): RedirectResponse
	{
		$comment = $quote->comments()->create([
			'user_id' => $request->user()->id,
			'body'    => $request->validated('body'),
		]);

		if ($quote->user_id !== $request->user()->id) {
			$quote->user->notify(new QuoteCommented($comment));
		}

		return $quote->shouldRedirectToFeed($request->validated('redirect_to'))
			? Redirect::route('feed')
			: Redirect::route('movies.show', $quote->movie_id);
	}
}
