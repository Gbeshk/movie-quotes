<?php

namespace App\Models;

use Database\Factories\QuoteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

#[Fillable(['movie_id', 'user_id', 'text'])]
class Quote extends Model implements HasMedia
{
	/** @use HasFactory<QuoteFactory> */
	use HasFactory, HasTranslations, InteractsWithMedia;

	protected $appends = ['image_url'];

	/**
	 * @var array<int, string>
	 */
	public array $translatable = ['text'];

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

	/**
	 * @return HasMany<Like, $this>
	 */
	public function likes(): HasMany
	{
		return $this->hasMany(Like::class);
	}

	/**
	 * @return HasMany<Comment, $this>
	 */
	public function comments(): HasMany
	{
		return $this->hasMany(Comment::class);
	}

	public function registerMediaCollections(): void
	{
		$this->addMediaCollection('image')->singleFile();
	}

	public function shouldRedirectToFeed(?string $redirectTo): bool
	{
		return $redirectTo === 'feed';
	}

	protected function imageUrl(): Attribute
	{
		return Attribute::make(
			get: fn () => $this->getFirstMediaUrl('image') ?: $this->movie?->getFirstMediaUrl('poster') ?: null,
		);
	}
}
