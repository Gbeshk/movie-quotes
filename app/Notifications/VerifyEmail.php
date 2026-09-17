<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmail extends BaseVerifyEmail
{
	public function toMail($notifiable): MailMessage
	{
		return (new MailMessage())
			->subject('Verify your email address')
			->view('emails.verify-email', [
				'username'  => $notifiable->username,
				'actionUrl' => $this->verificationUrl($notifiable),
			]);
	}
}
