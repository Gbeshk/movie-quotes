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
			'user_id' => User::factory(),
			'title'   => [
				'ka' => fake()->randomElement([
					'ბნელი რაინდი', 'დაკარგული საათი', 'უკანასკნელი მოგზაურობა',
				]),
				'en' => ucwords(fake()->words(3, true)),
			],
			'director' => [
				'ka' => fake()->randomElement([
					'გიორგი ხარაზი', 'ნინო წულუკიძე', 'დავით მაისურაძე',
				]),
				'en' => fake()->name(),
			],
			'genre' => fake()->randomElements(
				['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Crime', 'Fantasy', 'Documentary'],
				fake()->numberBetween(1, 3),
			),
			'release_year' => fake()->numberBetween(1970, (int) date('Y')),
			'description'  => [
				'ka' => 'ეს ფილმი მოგვითხრობს ერთ განსაკუთრებულ ისტორიას.',
				'en' => fake()->paragraph(),
			],
		];
	}
}
