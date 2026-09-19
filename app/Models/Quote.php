<?php

namespace App\Models;

use Database\Factories\QuoteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
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

	#[Scope]
	protected function search(Builder $query, ?string $search): void
	{
		if (blank($search)) {
			return;
		}

		$query->where(
			fn (Builder $query) => $query
				->where('text->en', 'like', "%{$search}%")
				->orWhere('text->ka', 'like', "%{$search}%"),
		);
	}

	#[Scope]
	protected function forPost(Builder $query, int $viewerId): void
	{
		$query
			->with([
				'user',
				'media',
				'movie.media',
				'comments' => fn ($query) => $query->with('user')->latest(),
			])
			->withCount(['likes', 'comments'])
			->withExists(['likes as is_liked_by_me' => fn ($query) => $query->where('user_id', $viewerId)]);
	}

	protected function imageUrl(): Attribute
	{
		return Attribute::make(
			get: fn () => $this->getFirstMediaUrl('image') ?: $this->movie?->getFirstMediaUrl('poster') ?: null,
		);
	}
}
