<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
	use RefreshDatabase;

	public function test_the_registration_route_redirects_to_the_welcome_page(): void
	{
		$response = $this->get('/register');
		$response->assertRedirect(route('welcome'));
	}

	public function test_new_users_can_register(): void
	{
		$response = $this->post('/register', [
			'username'              => 'testuser',
			'email'                 => 'test@example.com',
			'password'              => 'password',
			'password_confirmation' => 'password',
		]);

		$this->assertAuthenticated();
		$response->assertRedirect(route('dashboard', absolute: false));
	}

	public function test_registration_fails_with_empty_fields(): void
	{
		$response = $this->post('/register', []);
		$response->assertSessionHasErrors(['username', 'email', 'password']);
		$this->assertGuest();
	}
}
