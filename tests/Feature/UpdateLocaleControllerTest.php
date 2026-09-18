<?php

test('updating the locale sets a locale cookie', function () {
	$response = $this->post(route('locale.update'), ['locale' => 'ka']);

	$response->assertNoContent();
	$response->assertCookie('locale', 'ka');
});

test('updating the locale works for guests', function () {
	$response = $this->post(route('locale.update'), ['locale' => 'en']);

	$response->assertNoContent();
	$response->assertCookie('locale', 'en');
});

test('updating the locale rejects an unsupported locale', function () {
	$response = $this->post(route('locale.update'), ['locale' => 'fr']);

	$response->assertSessionHasErrors('locale');
});

test('updating the locale requires a locale', function () {
	$response = $this->post(route('locale.update'), []);

	$response->assertSessionHasErrors('locale');
});
