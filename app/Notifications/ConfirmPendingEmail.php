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
			->subject(__('emails.confirm_email.subject'))
			->view('emails.action', [
				'username'   => $this->user->username,
				'title'      => __('emails.confirm_email.subject'),
				'intro'      => __('emails.confirm_email.intro'),
				'buttonText' => __('emails.confirm_email.button'),
				'actionUrl'  => $url,
			]);
	}
}
