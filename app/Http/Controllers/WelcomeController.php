<?php

namespace App\Http\Controllers;

use App\Http\Resources\QuoteResource;
use App\Services\WelcomeQuoteSelector;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
	public function __construct(private readonly WelcomeQuoteSelector $quoteSelector)
	{
	}

	public function index(Request $request): Response
	{
		$quotes = $this->quoteSelector->select($request);

		if ($quotes->count() < 3) {
			$quotes = config('welcome.fallback_quotes');
		}

		return Inertia::render('Welcome', [
			'quotes'              => QuoteResource::collection($quotes),
			'resetPasswordToken'  => $request->query('reset_token'),
			'resetPasswordEmail'  => $request->query('reset_email'),
			'resetTokenExpired'   => $request->boolean('reset_expired'),
			'emailJustVerified'   => $request->boolean('verified'),
		]);
	}
}
