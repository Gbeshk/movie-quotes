<?php

namespace App\Http\Requests;

use App\Models\Comment;
use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
	public function authorize(): bool
	{
		return $this->user()->can('create', Comment::class);
	}

	public function rules(): array
	{
		return [
			'quote_id'    => ['required', 'integer', 'exists:quotes,id'],
			'body'        => ['required', 'string', 'max:2000'],
			'redirect_to' => ['nullable', 'in:feed'],
		];
	}
}
