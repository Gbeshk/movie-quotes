<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Database\Seeder;

class MovieSeeder extends Seeder
{
	public function run(): void
	{
		$user = User::where('email', 'giorgibeshkenadze4@gmail.com')->firstOrFail();

		Quote::all()->each(function (Quote $quote) {
			$quote->clearMediaCollection('image');
			$quote->delete();
		});

		Movie::all()->each(function (Movie $movie) {
			$movie->clearMediaCollection('poster');
			$movie->delete();
		});

		$sampleImages = [
			public_path('images/welcome-quotes/quote-1.jpg'),
			public_path('images/welcome-quotes/quote-2.jpg'),
			public_path('images/welcome-quotes/quote-3.jpg'),
		];

		collect(range(1, 50))->each(function () use ($user, $sampleImages) {
			$movie = Movie::factory()->for($user)->create();

			$movie->addMedia($sampleImages[array_rand($sampleImages)])
				->preservingOriginal()
				->toMediaCollection('poster');

			Quote::factory()
				->count(random_int(1, 3))
				->for($movie)
				->for($user)
				->create()
				->each(function (Quote $quote) use ($sampleImages) {
					$quote->addMedia($sampleImages[array_rand($sampleImages)])
						->preservingOriginal()
						->toMediaCollection('image');
				});
		});
	}
}
