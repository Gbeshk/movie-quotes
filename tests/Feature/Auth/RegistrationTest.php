<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
	use RefreshDatabase;

	/**
	 * @param array<string, string> $overrides
	 *
	 * @return array<string, string>
	 */
	private function validRegistrationData(array $overrides = []): array
	{
		return array_merge([
			'username'              => 'testuser',
			'email'                 => 'test@example.com',
			'password'              => 'password',
			'password_confirmation' => 'password',
		], $overrides);
	}

	public function test_the_registration_route_redirects_to_the_welcome_page(): void
	{
		$response = $this->get('/register');
		$response->assertRedirect(route('welcome'));
	}

	public function test_new_users_can_register_but_are_not_logged_in_until_verified(): void
	{
		$response = $this->post('/register', $this->validRegistrationData());

		$this->assertGuest();
		$response->assertSessionHasErrors('verification');

		$user = User::where('email', 'test@example.com')->firstOrFail();
		$this->assertFalse($user->hasVerifiedEmail());
	}

	public function test_registering_sends_an_email_verification_notification(): void
	{
		Notification::fake();

		$this->post('/register', $this->validRegistrationData());

		$user = User::where('email', 'test@example.com')->firstOrFail();
		Notification::assertSentTo($user, VerifyEmail::class);
	}

	public function test_registration_fails_with_empty_fields(): void
	{
		$response = $this->post('/register', []);
		$response->assertSessionHasErrors(['username', 'email', 'password']);
		$this->assertGuest();
	}

	public function test_registration_fails_with_a_descriptive_message_for_an_invalid_username(): void
	{
		$response = $this->from('/')->post('/register', $this->validRegistrationData([
			'username' => 'Invalid Name!',
		]));

		$response->assertSessionHasErrors([
			'username' => 'Must be 3-15 lowercase letters or numbers.',
		]);
	}

	public function test_registration_fails_with_a_descriptive_message_for_an_invalid_password(): void
	{
		$response = $this->from('/')->post('/register', $this->validRegistrationData([
			'password'              => 'Invalid Password!',
			'password_confirmation' => 'Invalid Password!',
		]));

		$response->assertSessionHasErrors([
			'password' => 'Must be 8-15 lowercase letters or numbers.',
		]);
	}
}
