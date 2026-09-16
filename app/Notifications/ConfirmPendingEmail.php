<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class ConfirmPendingEmail extends Notification
{
	public function __construct(private readonly User $user)
	{
	}

	public function via($notifiable): array
	{
		return ['mail'];
	}

	public function toMail($notifiable): MailMessage
	{
		$url = URL::temporarySignedRoute(
			'email.pending.confirm',
			now()->addMinutes(60),
			['user' => $this->user->id]
		);

		return (new MailMessage())
			->subject('Confirm your new email address')
			->line('You recently asked to change the email address on your account.')
			->action('Confirm email address', $url)
			->line('This link expires in 60 minutes. If you did not request this change, no further action is required.');
	}
}
