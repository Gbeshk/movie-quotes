<?php

namespace App\Events;

use App\Models\Quote;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuoteLikeToggled implements ShouldBroadcast
{
	use Dispatchable, InteractsWithSockets, SerializesModels;

	public function __construct(public readonly Quote $quote)
	{
	}

	/**
	 * @return array<int, Channel>
	 */
	public function broadcastOn(): array
	{
		return [new Channel("quote.{$this->quote->id}")];
	}

	public function broadcastAs(): string
	{
		return 'QuoteLikeToggled';
	}

	/**
	 * @return array{likes_count: int}
	 */
	public function broadcastWith(): array
	{
		return ['likes_count' => $this->quote->likes()->count()];
	}
}
