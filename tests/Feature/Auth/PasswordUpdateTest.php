<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
	use RefreshDatabase;

	public function test_password_can_be_updated(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->from('/profile')
			->put('/password', [
				'current_password'      => 'password',
				'password'              => 'newpassword',
				'password_confirmation' => 'newpassword',
			]);

		$response
			->assertSessionHasNoErrors()
			->assertRedirect('/profile');

		$this->assertTrue(Hash::check('newpassword', $user->refresh()->password));
	}

	public function test_correct_password_must_be_provided_to_update_password(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->from('/profile')
			->put('/password', [
				'current_password'      => 'wrong-password',
				'password'              => 'newpassword',
				'password_confirmation' => 'newpassword',
			]);

		$response
			->assertSessionHasErrors('current_password')
			->assertRedirect('/profile');
	}

	public function test_the_new_password_must_be_lowercase_letters_or_numbers(): void
	{
		$user = User::factory()->create();

		$response = $this
			->actingAs($user)
			->from('/profile')
			->put('/password', [
				'current_password'      => 'password',
				'password'              => 'New-Password1',
				'password_confirmation' => 'New-Password1',
			]);

		$response
			->assertSessionHasErrors(['password' => 'Must be 8-15 lowercase letters or numbers.'])
			->assertRedirect('/profile');
	}
}
