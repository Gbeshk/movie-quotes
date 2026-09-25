<?php

namespace App\Events;

use App\Http\Resources\CommentResource;
use App\Models\Comment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CommentPosted implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public function __construct(public readonly Comment $comment)
	{
	}

	/**
	 * @return array<int, Channel>
	 */
	public function broadcastOn(): array
	{
		return [new Channel("quote.{$this->comment->quote_id}")];
	}

	public function broadcastAs(): string
	{
		return 'CommentPosted';
	}

	/**
	 * @return array{comment: array<string, mixed>, comments_count: int}
	 */
	public function broadcastWith(): array
	{
		return [
			'comment'        => (new CommentResource($this->comment->load('user')))->resolve(),
			'comments_count' => $this->comment->quote->comments()->count(),
		];
	}
}
