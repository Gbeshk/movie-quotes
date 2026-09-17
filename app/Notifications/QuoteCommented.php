<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class QuoteCommented extends Notification implements ShouldQueue
{
	use Queueable;

	public function __construct(private readonly Comment $comment)
	{
	}

	public function via($notifiable): array
	{
		return ['database', 'broadcast'];
	}

	public function toArray($notifiable): array
	{
		return [
			'kind'         => 'comment',
			'quote_id'     => $this->comment->quote_id,
			'movie_id'     => $this->comment->quote->movie_id,
			'comment_id'   => $this->comment->id,
			'commenter_id' => $this->comment->user_id,
			'commenter'    => $this->comment->user->username,
			'avatar_url'   => $this->comment->user->avatar_url,
			'body'         => $this->comment->body,
		];
	}

	public function toBroadcast($notifiable): BroadcastMessage
	{
		return new BroadcastMessage($this->toArray($notifiable));
	}

	public function broadcastType(): string
	{
		return 'QuoteCommented';
	}
}
