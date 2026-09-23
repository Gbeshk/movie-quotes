<?php

namespace App\QueryFilters;

use Illuminate\Database\Eloquent\Builder;
use Spatie\QueryBuilder\Filters\Filter;

class MovieSearchFilter implements Filter
{
	public function __invoke(Builder $query, mixed $value, string $property): void
	{
		$search = trim((string) $value);

		if ($search === '') {
			return;
		}

		if (str_starts_with($search, '@')) {
			$query->search(substr($search, 1));

			return;
		}

		if (str_starts_with($search, '#')) {
			$query->whereHas('quotes', fn ($query) => $query->search(substr($search, 1)));

			return;
		}

		$query->where(
			fn ($query) => $query
				->search($search)
				->orWhere(fn ($query) => $query->whereHas('quotes', fn ($query) => $query->search($search))),
		);
	}
}
