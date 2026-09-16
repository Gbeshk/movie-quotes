<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
	use WithoutModelEvents;

	/**
	 * Seed the application's database.
	 */
	public function run(): void
	{
		$testUser = User::factory()->create([
			'username' => 'testuser',
			'email'    => 'test@example.com',
		]);

		$users = User::factory()->count(8)->create()->push($testUser);

		$users->each(function (User $owner) use ($users) {
			Movie::factory()
				->count(rand(1, 3))
				->for($owner)
				->create()
				->each(function (Movie $movie) use ($owner, $users) {
					Quote::factory()
						->count(rand(2, 4))
						->for($movie)
						->for($owner)
						->create()
						->each(function (Quote $quote) use ($users) {
							$users->random(rand(0, 4))->each(
								fn (User $commenter) => Comment::factory()->for($commenter)->for($quote)->create()
							);

							$users->random(rand(0, min(5, $users->count())))->each(
								fn (User $liker) => Like::factory()->for($liker)->for($quote)->create()
							);
						});
				});
		});
	}
}
