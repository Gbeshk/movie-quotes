<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\ConfirmPendingEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class ProfileTest extends TestCase
{
	use RefreshDatabase;

	public function test_profile_page_is_displayed(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->get('/profile');

		$response->assertOk();
	}

	public function test_the_username_can_be_updated_immediately(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->patch('/profile', [
				'username' => 'testuser',
				'email'    => $user->email,
			]);

		$response
			->assertSessionHasNoErrors()
			->assertRedirect('/profile');

		$this->assertSame('testuser', $user->refresh()->username);
	}

	public function test_changing_the_email_stages_it_as_pending_instead_of_changing_it_immediately(): void
	{
		Notification::fake();

		$user = User::factory()->create(['email' => 'old@example.com']);

		$response = $this
			->actingAs($user)
			->patch('/profile', [
				'username' => $user->username,
				'email'    => 'new@example.com',
			]);

		$response
			->assertSessionHasNoErrors()
			->assertRedirect('/profile');

		$user->refresh();

		$this->assertSame('old@example.com', $user->email);
		$this->assertSame('new@example.com', $user->pending_email);
		$this->assertNotNull($user->email_verified_at);

		Notification::assertSentOnDemand(
			ConfirmPendingEmail::class,
			fn ($notification, $channels, $notifiable) => $notifiable->routes['mail'] === 'new@example.com'
		);
	}

	public function test_profile_routes_stay_accessible_while_an_email_change_is_pending(): void
	{
		$user = User::factory()->create();

		$this
			->actingAs($user)
			->patch('/profile', [
				'username' => $user->username,
				'email'    => 'new@example.com',
			]);

		$response = $this->actingAs($user)->get('/profile');

		$response->assertOk();
	}

	public function test_confirming_the_pending_email_link_applies_the_new_email(): void
	{
		$user = User::factory()->create(['email' => 'old@example.com', 'pending_email' => 'new@example.com']);

		$url = URL::temporarySignedRoute('email.pending.confirm', now()->addMinutes(60), ['user' => $user->id]);

		$response = $this->actingAs($user)->get($url);

		$response->assertRedirect(route('profile.edit'));

		$user->refresh();

		$this->assertSame('new@example.com', $user->email);
		$this->assertNull($user->pending_email);
		$this->assertNotNull($user->email_verified_at);
	}

	public function test_a_user_cannot_confirm_another_users_pending_email(): void
	{
		$owner = User::factory()->create(['pending_email' => 'new@example.com']);
		$otherUser = User::factory()->create();

		$url = URL::temporarySignedRoute('email.pending.confirm', now()->addMinutes(60), ['user' => $owner->id]);

		$response = $this->actingAs($otherUser)->get($url);

		$response->assertForbidden();
	}

	public function test_profile_update_fails_with_a_descriptive_message_for_an_invalid_username(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->from('/profile')
			->patch('/profile', [
				'username' => 'Invalid Name!',
				'email'    => $user->email,
			]);

		$response->assertSessionHasErrors([
			'username' => 'Must be 3-15 lowercase letters or numbers.',
		]);
	}

	public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->patch('/profile', [
				'username' => 'testuser',
				'email'    => $user->email,
			]);

		$response
			->assertSessionHasNoErrors()
			->assertRedirect('/profile');

		$this->assertNotNull($user->refresh()->email_verified_at);
	}

	public function test_avatar_can_be_uploaded(): void
	{
		Storage::fake('public');

		$user = User::factory()->create();

		$this->assertNull($user->avatar_url);

		$response = $this
			->actingAs($user)
			->post('/profile/avatar', [
				'avatar' => UploadedFile::fake()->create('avatar.jpg', 100, 'image/jpeg'),
			]);

		$response
			->assertSessionHasNoErrors()
			->assertRedirect('/profile');

		$this->assertNotNull($user->fresh()->avatar_url);
	}

	public function test_avatar_upload_requires_an_image(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->from('/profile')
			->post('/profile/avatar', [
				'avatar' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
			]);

		$response
			->assertSessionHasErrors('avatar')
			->assertRedirect('/profile');

		$this->assertNull($user->fresh()->avatar_url);
	}

	public function test_user_can_delete_their_account(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->delete('/profile', [
				'password' => 'password',
			]);

		$response
			->assertSessionHasNoErrors()
			->assertRedirect('/');

		$this->assertGuest();
		$this->assertNull($user->fresh());
	}

	public function test_correct_password_must_be_provided_to_delete_account(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->from('/profile')
			->delete('/profile', [
				'password' => 'wrong-password',
			]);

		$response
			->assertSessionHasErrors('password')
			->assertRedirect('/profile');

		$this->assertNotNull($user->fresh());
	}
}
