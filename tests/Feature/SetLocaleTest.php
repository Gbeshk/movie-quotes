<?php

test('the locale cookie switches the app locale to georgian', function () {
	$this->withUnencryptedCookies(['locale' => 'ka'])->get(route('welcome'));

	expect(app()->getLocale())->toBe('ka');
});

test('a missing locale cookie defaults the app locale to english', function () {
	$this->get(route('welcome'));

	expect(app()->getLocale())->toBe('en');
});

test('an unsupported locale cookie falls back to english', function () {
	$this->withUnencryptedCookies(['locale' => 'fr'])->get(route('welcome'));

	expect(app()->getLocale())->toBe('en');
});
