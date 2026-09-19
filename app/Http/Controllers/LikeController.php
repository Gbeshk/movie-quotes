<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToggleLikeRequest;
use App\Models\Quote;
use App\Notifications\QuoteLiked;
use Illuminate\Http\RedirectResponse;

class LikeController extends Controller
{
	public function toggle(ToggleLikeRequest $request, Quote $quote): RedirectResponse
	{
		$like = $quote->likes()->where('user_id', $request->user()->id)->first();

		if ($like) {
			$like->delete();
		} else {
			$like = $quote->likes()->create(['user_id' => $request->user()->id]);

			if ($quote->user_id !== $request->user()->id) {
				$quote->user->notify(new QuoteLiked($like));
			}
		}

		return back();
	}
}
