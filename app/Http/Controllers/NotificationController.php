<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
	public function index(Request $request): JsonResponse
	{
		return response()->json(
			$request->user()->notifications()->latest()->limit(20)->get(['id', 'data', 'read_at', 'created_at']),
		);
	}

	public function markAllRead(Request $request): Response
	{
		$request->user()->unreadNotifications->markAsRead();

		return response()->noContent();
	}
}
