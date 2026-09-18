<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPassword extends BaseResetPassword
{
	public function toMail($notifiable): MailMessage
	{
		return (new MailMessage())
			->subject(__('emails.reset.subject'))
			->view('emails.action', [
				'username'   => $notifiable->username,
				'title'      => __('emails.reset.subject'),
				'intro'      => __('emails.reset.intro'),
				'buttonText' => __('emails.reset.button'),
				'actionUrl'  => $this->resetUrl($notifiable),
			]);
	}
}
