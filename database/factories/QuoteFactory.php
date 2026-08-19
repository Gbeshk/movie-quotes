<?php

namespace Database\Factories;

use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Quote>
 */
class QuoteFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array
	{
		return [
			'movie_id' => Movie::factory(),
			'user_id'  => User::factory(),
			'text'     => [
				'ka' => fake()->randomElement([
					'ცხოვრება ლამაზია.',
					'იმედი კარგი რამაა.',
					'ყველაფერი შესაძლებელია.',
				]),
				'en' => fake()->sentence(),
			],
		];
	}
}
