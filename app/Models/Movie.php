<?php

namespace App\Models;

use Database\Factories\MovieFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;

#[Fillable(['user_id', 'title', 'director', 'genre', 'release_year', 'description'])]
class Movie extends Model implements HasMedia
{
	/** @use HasFactory<MovieFactory> */
	use HasFactory, HasTranslations, InteractsWithMedia;

	protected $appends = ['poster_url'];

	/**
	 * @var array<int, string>
	 */
	public array $translatable = ['title', 'director', 'description'];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'release_year' => 'integer',
		];
	}

	/**
	 * @return BelongsTo<User, $this>
	 */
	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	/**
	 * @return HasMany<Quote, $this>
	 */
	public function quotes(): HasMany
	{
		return $this->hasMany(Quote::class);
	}

	public function registerMediaCollections(): void
	{
		$this->addMediaCollection('poster')->singleFile();
	}

	protected function posterUrl(): Attribute
	{
		return Attribute::make(
			get: fn () => $this->getFirstMediaUrl('poster') ?: null,
		);
	}
}
