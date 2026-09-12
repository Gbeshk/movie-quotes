<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Quote;
use App\Notifications\QuoteCommented;
use Illuminate\Http\RedirectResponse;

class CommentController extends Controller
{
	public function store(StoreCommentRequest $request): RedirectResponse
	{
		$quote = Quote::findOrFail($request->validated('quote_id'));

		$comment = $quote->comments()->create([
			'user_id' => $request->user()->id,
			'body'    => $request->validated('body'),
		]);

		if ($quote->user_id !== $request->user()->id) {
			$quote->user->notify(new QuoteCommented($comment));
		}

		return $this->redirectToFeedOr($request->validated('redirect_to'), 'movies.show', $quote->movie_id);
	}
}
