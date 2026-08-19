<?php

namespace App\Models;

use Database\Factories\CommentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'quote_id', 'body'])]
class Comment extends Model
{
	/** @use HasFactory<CommentFactory> */
	use HasFactory;

	/**
	 * @return BelongsTo<User, $this>
	 */
	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	/**
	 * @return BelongsTo<Quote, $this>
	 */
	public function quote(): BelongsTo
	{
		return $this->belongsTo(Quote::class);
	}
}
