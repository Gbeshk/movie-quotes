<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void
	{
		DB::table('movies')->select('id', 'genre')->get()->each(function ($movie) {
			DB::table('movies')->where('id', $movie->id)->update([
				'genre' => json_encode([$movie->genre]),
			]);
		});

		Schema::table('movies', function (Blueprint $table) {
			$table->json('genre')->change();
		});
	}

	public function down(): void
	{
		Schema::table('movies', function (Blueprint $table) {
			$table->string('genre')->change();
		});

		DB::table('movies')->select('id', 'genre')->get()->each(function ($movie) {
			$genres = json_decode($movie->genre, true) ?? [];

			DB::table('movies')->where('id', $movie->id)->update([
				'genre' => $genres[0] ?? '',
			]);
		});
	}
};
