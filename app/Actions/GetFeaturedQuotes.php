<?php

namespace App\Actions;

use App\Models\Quote;

class GetFeaturedQuotes
{
	/**
	 * @return array<int, array{id: int|string, text: array<string, string>, movie: array{title: array<string, string>, release_year: int, poster_url: string}}>
	 */
	public function __invoke(): array
	{
		$quotes = Quote::query()
			->whereHas('movie.media', fn ($query) => $query->where('collection_name', 'poster'))
			->with('movie.media')
			->inRandomOrder()
			->limit(3)
			->get();

		if ($quotes->count() < 3) {
			return $this->fallback();
		}

		return $quotes->map(fn (Quote $quote) => [
			'id'    => $quote->id,
			'text'  => $quote->getTranslations('text'),
			'movie' => [
				'title'        => $quote->movie->getTranslations('title'),
				'release_year' => $quote->movie->release_year,
				'poster_url'   => $quote->movie->getFirstMediaUrl('poster'),
			],
		])->all();
	}

	/**
	 * @return array<int, array{id: string, text: array<string, string>, movie: array{title: array<string, string>, release_year: int, poster_url: string}}>
	 */
	private function fallback(): array
	{
		return [
			[
				'id'   => 'fallback-1',
				'text' => [
					'en' => "I'm gonna make him an offer he can't refuse.",
					'ka' => 'მე მას ისეთ შემოთავაზებას გავუკეთებ, რომელსაც ვერ უარყოფს.',
				],
				'movie' => [
					'title'        => ['en' => 'The Godfather', 'ka' => 'ნათლია'],
					'release_year' => 1972,
					'poster_url'   => asset('images/welcome-quotes/quote-1.jpg'),
				],
			],
			[
				'id'   => 'fallback-2',
				'text' => [
					'en' => "Life is like a box of chocolates, you never know what you're gonna get.",
					'ka' => 'ცხოვრება შოკოლადის ყუთივითაა, არასდროს იცი რას მიიღებ.',
				],
				'movie' => [
					'title'        => ['en' => 'Forrest Gump', 'ka' => 'ფორესტ განპი'],
					'release_year' => 1994,
					'poster_url'   => asset('images/welcome-quotes/quote-2.jpg'),
				],
			],
			[
				'id'   => 'fallback-3',
				'text' => [
					'en' => 'Get busy living, or get busy dying.',
					'ka' => 'ან ცხოვრებას შეუდექი, ან სიკვდილს.',
				],
				'movie' => [
					'title'        => ['en' => 'The Shawshank Redemption', 'ka' => 'გამოსყიდვა შოუშენკში'],
					'release_year' => 1994,
					'poster_url'   => asset('images/welcome-quotes/quote-3.jpg'),
				],
			],
		];
	}
}
