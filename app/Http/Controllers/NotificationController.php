<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
	public function markAllRead(Request $request): Response
	{
		$request->user()->unreadNotifications->markAsRead();

		return response()->noContent();
	}
}
