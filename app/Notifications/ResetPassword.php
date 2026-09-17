<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPassword extends BaseResetPassword
{
	public function toMail($notifiable): MailMessage
	{
		return (new MailMessage())
			->subject('Reset your password')
			->view('emails.reset-password', [
				'username'  => $notifiable->username,
				'actionUrl' => $this->resetUrl($notifiable),
			]);
	}
}
