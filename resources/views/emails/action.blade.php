@extends('emails.layout')

@section('title', $title)

@section('content')
    <tr>
        <td align="left" style="padding-top:24px;">
            <p style="margin:0; color:#ffffff; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-align:left;">
                {{ $intro }}
            </p>
        </td>
    </tr>
    <tr>
        <td align="left" style="padding-top:32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" bgcolor="#e31221" style="border-radius:4px;">
                        <a href="{{ $actionUrl }}" style="display:inline-block; padding:10px 24px; white-space:nowrap; color:#ffffff; font-size:16px; font-weight:400; line-height:1.5; text-decoration:none; text-align:center;">
                            {{ $buttonText }}
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td align="left" style="padding-top:40px;">
            <p style="margin:0; color:#ffffff; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-align:left;">
                {{ __('emails.fallback_hint') }}
            </p>
        </td>
    </tr>
    <tr>
        <td align="left" style="padding-top:24px; word-break:break-all;">
            <a href="{{ $actionUrl }}" style="color:#ddccaa; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-decoration:none;">
                {{ $actionUrl }}
            </a>
        </td>
    </tr>
@endsection
