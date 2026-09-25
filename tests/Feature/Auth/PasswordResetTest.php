<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
	use RefreshDatabase;

	public function test_the_forgot_password_route_redirects_to_the_welcome_page(): void
	{
		$response = $this->get('/forgot-password');

		$response->assertRedirect(route('welcome'));
	}

	public function test_requesting_a_reset_link_for_an_unregistered_email_fails_validation(): void
	{
		$response = $this->post('/forgot-password', ['email' => 'nobody@example.com']);

		$response->assertSessionHasErrors('email');
	}

	public function test_requesting_a_reset_link_for_a_registered_email_succeeds(): void
	{
		$user = User::factory()->create();

		$response = $this->post('/forgot-password', ['email' => $user->email]);

		$response->assertSessionHasNoErrors();
		expect(session('status'))->not->toBeEmpty();
	}

	public function test_a_google_only_account_cannot_request_a_reset_link(): void
	{
		Notification::fake();

		$user = User::factory()->create(['google_id' => '123456789', 'password' => null]);

		$response = $this->post('/forgot-password', ['email' => $user->email]);

		$response->assertSessionHasErrors('email');
		Notification::assertNotSentTo($user, ResetPassword::class);
	}

	public function test_reset_password_link_can_be_requested(): void
	{
		Notification::fake();

		$user = User::factory()->create();

		$this->post('/forgot-password', ['email' => $user->email]);

		Notification::assertSentTo($user, ResetPassword::class);
	}

	public function test_the_reset_password_link_redirects_to_the_welcome_page(): void
	{
		Notification::fake();

		$user = User::factory()->create();

		$this->post('/forgot-password', ['email' => $user->email]);

		Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
			$response = $this->get('/reset-password/' . $notification->token . '?email=' . urlencode($user->email));

			$response->assertRedirect(route('welcome', [
				'reset_token' => $notification->token,
				'reset_email' => $user->email,
			]));

			return true;
		});
	}

	public function test_an_invalid_reset_token_redirects_to_the_welcome_page_flagged_as_expired(): void
	{
		$user = User::factory()->create();

		$response = $this->get('/reset-password/not-a-real-token?email=' . urlencode($user->email));

		$response->assertRedirect(route('welcome', [
			'reset_token'   => 'not-a-real-token',
			'reset_email'   => $user->email,
			'reset_expired' => 1,
		]));
	}

	public function test_password_can_be_reset_with_valid_token(): void
	{
		Notification::fake();

		$user = User::factory()->create();

		$this->post('/forgot-password', ['email' => $user->email]);

		Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
			$response = $this->post('/reset-password', [
				'token'                 => $notification->token,
				'email'                 => $user->email,
				'password'              => 'password',
				'password_confirmation' => 'password',
			]);

			$response
				->assertSessionHasNoErrors()
				->assertRedirect(route('welcome'));

			return true;
		});
	}

	public function test_the_new_password_must_be_lowercase_letters_or_numbers(): void
	{
		Notification::fake();

		$user = User::factory()->create();

		$this->post('/forgot-password', ['email' => $user->email]);

		Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
			$response = $this->post('/reset-password', [
				'token'                 => $notification->token,
				'email'                 => $user->email,
				'password'              => 'New-Password1',
				'password_confirmation' => 'New-Password1',
			]);

			$response->assertSessionHasErrors(['password' => 'Must be 8-15 lowercase letters or numbers.']);

			return true;
		});
	}
}
