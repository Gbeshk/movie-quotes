<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
	public function up(): void
	{
		DB::table('movies')->select('id', 'genre')->get()->each(function ($movie) {
			DB::table('movies')->where('id', $movie->id)->update([
				'genre' => json_encode([$movie->genre]),
			]);
		});
	}

	public function down(): void
	{
		DB::table('movies')->select('id', 'genre')->get()->each(function ($movie) {
			$genres = json_decode($movie->genre, true) ?? [];

			DB::table('movies')->where('id', $movie->id)->update([
				'genre' => $genres[0] ?? '',
			]);
		});
	}
};
