<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateLocaleRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;

class UpdateLocaleController extends Controller
{
	public function __invoke(UpdateLocaleRequest $request): Response
	{
		Cookie::queue('locale', $request->validated('locale'), 60 * 24 * 365);

		return response()->noContent();
	}
}
