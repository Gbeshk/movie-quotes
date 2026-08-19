<?php

namespace App\Models;

use Database\Factories\QuoteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable(['movie_id', 'user_id', 'text_ka', 'text_en'])]
class Quote extends Model implements HasMedia
{
	/** @use HasFactory<QuoteFactory> */
	use HasFactory, InteractsWithMedia;

	/**
	 * @return BelongsTo<Movie, $this>
	 */
	public function movie(): BelongsTo
	{
		return $this->belongsTo(Movie::class);
	}

	/**
	 * @return BelongsTo<User, $this>
	 */
	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function registerMediaCollections(): void
	{
		$this->addMediaCollection('image')->singleFile();
	}
}
