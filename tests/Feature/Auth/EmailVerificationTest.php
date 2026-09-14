<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
	use RefreshDatabase;

	public function test_a_guest_can_verify_their_email_from_the_link_and_is_logged_in(): void
	{
		$user = User::factory()->unverified()->create();

		Event::fake();

		$verificationUrl = URL::temporarySignedRoute(
			'verification.verify',
			now()->addMinutes(60),
			['id' => $user->id, 'hash' => sha1($user->email)]
		);

		$response = $this->get($verificationUrl);

		Event::assertDispatched(Verified::class);
		$this->assertTrue($user->fresh()->hasVerifiedEmail());
		$this->assertAuthenticatedAs($user);
		$response->assertRedirect(route('welcome', ['verified' => 1]));
	}

	public function test_email_is_not_verified_with_invalid_hash(): void
	{
		$user = User::factory()->unverified()->create();

		$verificationUrl = URL::temporarySignedRoute(
			'verification.verify',
			now()->addMinutes(60),
			['id' => $user->id, 'hash' => sha1('wrong-email')]
		);

		$response = $this->get($verificationUrl);

		$response->assertForbidden();
		$this->assertFalse($user->fresh()->hasVerifiedEmail());
		$this->assertGuest();
	}

	public function test_unverified_users_are_redirected_to_the_welcome_page_from_protected_routes(): void
	{
		$user = User::factory()->unverified()->create();

		$response = $this->actingAs($user)->get('/feed');

		$response->assertRedirect(route('welcome'));
	}
}
