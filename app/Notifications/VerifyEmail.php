<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmail extends BaseVerifyEmail
{
	public function toMail($notifiable): MailMessage
	{
		return (new MailMessage())
			->subject(__('emails.verify.subject'))
			->view('emails.action', [
				'username'   => $notifiable->username,
				'title'      => __('emails.verify.subject'),
				'intro'      => __('emails.verify.intro'),
				'buttonText' => __('emails.verify.button'),
				'actionUrl'  => $this->verificationUrl($notifiable),
			]);
	}
}
