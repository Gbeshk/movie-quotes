<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
	use RefreshDatabase;

	public function test_the_login_route_redirects_to_the_welcome_page(): void
	{
		$response = $this->get('/login');

		$response->assertRedirect(route('welcome'));
	}

	public function test_users_can_authenticate_using_the_login_screen(): void
	{
		$user = User::factory()->create();

		$response = $this->post('/login', [
			'email'    => $user->email,
			'password' => 'password',
		]);

		$this->assertAuthenticated();
		$response->assertRedirect(route('dashboard', absolute: false));
	}

	public function test_users_can_not_authenticate_with_invalid_password(): void
	{
		$user = User::factory()->create();

		$this->post('/login', [
			'email'    => $user->email,
			'password' => 'wrong-password',
		]);

		$this->assertGuest();
	}

	public function test_users_can_logout(): void
	{
		$user = User::factory()->create();

		$response = $this->actingAs($user)->post('/logout');

		$this->assertGuest();
		$response->assertRedirect('/');
	}

	public function test_login_fails_with_empty_fields(): void
	{
		$response = $this->post('/login', []);

		$response->assertSessionHasErrors(['email', 'password']);
		$this->assertGuest();
	}

	public function test_unverified_users_can_not_authenticate_using_the_login_screen(): void
	{
		$user = User::factory()->unverified()->create();

		$response = $this->post('/login', [
			'email'    => $user->email,
			'password' => 'password',
		]);

		$response->assertSessionHasErrors(['verification']);
		$this->assertGuest();
	}

	public function test_unverified_users_can_resend_the_verification_email_from_the_login_screen(): void
	{
		Notification::fake();

		$user = User::factory()->unverified()->create();

		$response = $this->post('/email/verification-notification/resend', [
			'email'    => $user->email,
			'password' => 'password',
		]);

		$response->assertRedirect();
		Notification::assertSentTo($user, VerifyEmail::class);
	}

	public function test_resending_the_verification_email_fails_with_invalid_credentials(): void
	{
		Notification::fake();

		$user = User::factory()->unverified()->create();

		$response = $this->post('/email/verification-notification/resend', [
			'email'    => $user->email,
			'password' => 'wrong-password',
		]);

		$response->assertSessionHasErrors(['verification']);
		Notification::assertNothingSent();
	}
}
