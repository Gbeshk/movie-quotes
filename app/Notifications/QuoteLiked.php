<?php

namespace App\Notifications;

use App\Models\Like;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class QuoteLiked extends Notification
{
	public function __construct(private readonly Like $like)
	{
	}

	public function via($notifiable): array
	{
		return ['database', 'broadcast'];
	}

	public function toArray($notifiable): array
	{
		return [
			'kind'     => 'like',
			'quote_id' => $this->like->quote_id,
			'liker_id' => $this->like->user_id,
			'liker'    => $this->like->user->username,
		];
	}

	public function toBroadcast($notifiable): BroadcastMessage
	{
		return new BroadcastMessage($this->toArray($notifiable));
	}

	public function broadcastType(): string
	{
		return 'QuoteLiked';
	}
}
