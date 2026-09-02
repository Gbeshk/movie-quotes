<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Tests\TestCase;

class GoogleAuthTest extends TestCase
{
	use RefreshDatabase;

	private function fakeGoogleUser(array $attributes = []): SocialiteUser
	{
		return (new SocialiteUser())->map(array_merge([
			'id'    => 'google-id-123',
			'name'  => 'Test User',
			'email' => 'googleuser@example.com',
		], $attributes));
	}

	public function test_new_users_can_register_via_google(): void
	{
		Socialite::fake('google', $this->fakeGoogleUser());

		$response = $this->get('/auth/google/callback');

		$this->assertAuthenticated();
		$response->assertRedirect(route('welcome'));

		$user = User::firstWhere('email', 'googleuser@example.com');

		$this->assertNotNull($user);
		$this->assertSame('google-id-123', $user->google_id);
		$this->assertNull($user->password);
		$this->assertTrue($user->hasVerifiedEmail());
	}

	public function test_existing_google_users_can_sign_in_again(): void
	{
		$existing = User::factory()->create([
			'email'     => 'googleuser@example.com',
			'google_id' => 'google-id-123',
		]);

		Socialite::fake('google', $this->fakeGoogleUser());

		$this->get('/auth/google/callback');

		$this->assertAuthenticatedAs($existing);
		$this->assertSame(1, User::where('email', 'googleuser@example.com')->count());
	}

	public function test_existing_password_account_is_linked_by_email(): void
	{
		$existing = User::factory()->unverified()->create([
			'email'     => 'googleuser@example.com',
			'google_id' => null,
		]);

		Socialite::fake('google', $this->fakeGoogleUser());

		$this->get('/auth/google/callback');

		$this->assertAuthenticatedAs($existing);
		$this->assertSame('google-id-123', $existing->fresh()->google_id);
		$this->assertTrue($existing->fresh()->hasVerifiedEmail());
	}

	public function test_username_conflicts_are_resolved_with_a_unique_suffix(): void
	{
		User::factory()->create(['username' => 'testuser']);

		Socialite::fake('google', $this->fakeGoogleUser(['name' => 'Test User']));

		$this->get('/auth/google/callback');

		$user = User::firstWhere('email', 'googleuser@example.com');

		$this->assertNotSame('testuser', $user->username);
		$this->assertMatchesRegularExpression('/^[a-z0-9]{3,15}$/', $user->username);
		$this->assertSame(1, User::where('username', $user->username)->count());
	}

	public function test_failed_google_authentication_redirects_to_welcome(): void
	{
		Socialite::fake('google', function () {
			throw new \RuntimeException('The user denied the request.');
		});

		$response = $this->get('/auth/google/callback');

		$response->assertRedirect(route('welcome'));
		$this->assertGuest();
	}
}
