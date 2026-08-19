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
			'user_id'       => User::factory(),
			'title_ka'      => fake()->randomElement([
				'ბნელი რაინდი', 'დაკარგული საათი', 'უკანასკნელი მოგზაურობა',
			]),
			'title_en'      => ucwords(fake()->words(3, true)),
			'director_ka'   => fake()->randomElement([
				'გიორგი ხარაზი', 'ნინო წულუკიძე', 'დავით მაისურაძე',
			]),
			'director_en'   => fake()->name(),
			'genre'         => fake()->randomElement([
				'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
				'Thriller', 'Romance', 'Crime', 'Fantasy', 'Documentary',
			]),
			'release_year'   => fake()->numberBetween(1970, (int) date('Y')),
			'description_ka' => 'ეს ფილმი მოგვითხრობს ერთ განსაკუთრებულ ისტორიას.',
			'description_en' => fake()->paragraph(),
		];
	}
}
