<?php

namespace App\Models;

use App\Notifications\ResetPassword;
use App\Notifications\VerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable(['username', 'email', 'password', 'google_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements HasMedia, MustVerifyEmail
{
	/** @use HasFactory<UserFactory> */
	use HasFactory, InteractsWithMedia, Notifiable;

	protected $appends = ['avatar_url', 'has_password'];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array
	{
		return [
			'email_verified_at' => 'datetime',
			'password'          => 'hashed',
		];
	}

	protected function avatarUrl(): Attribute
	{
		return Attribute::make(
			get: fn () => $this->getFirstMediaUrl('avatar') ?: null,
		);
	}

	protected function hasPassword(): Attribute
	{
		return Attribute::make(
			get: fn () => $this->password !== null,
		);
	}

	public function registerMediaCollections(): void
	{
		$this->addMediaCollection('avatar')->singleFile();
	}

	public function sendEmailVerificationNotification(): void
	{
		$this->notify(new VerifyEmail());
	}

	public function sendPasswordResetNotification(#[\SensitiveParameter] $token): void
	{
		$this->notify(new ResetPassword($token));
	}
}
