<?php

namespace Database\Factories;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Movie>
 */
class MovieFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
			'user_id'      => User::factory(),
			'title'        => ucwords(fake()->words(3, true)),
			'director'     => fake()->name(),
			'genre'        => fake()->randomElement([
				'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
				'Thriller', 'Romance', 'Crime', 'Fantasy', 'Documentary',
			]),
			'release_year' => fake()->numberBetween(1970, (int) date('Y')),
			'description'  => fake()->paragraph(),
		];
	}
}
