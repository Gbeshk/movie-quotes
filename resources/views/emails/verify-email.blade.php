@extends('emails.layout')

@section('title', 'Verify your email address')

@section('content')
    <tr>
        <td align="left" style="padding-top:24px;">
            <p style="margin:0; color:#ffffff; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-align:left;">
                Thanks for joining Movie quotes! We really appreciate it. Please click the button below to verify your account:
            </p>
        </td>
    </tr>
    <tr>
        <td align="left" style="padding-top:32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td align="center" bgcolor="#e31221" style="border-radius:4px;">
                        <a href="{{ $actionUrl }}" style="display:inline-block; width:128px; height:38px; line-height:38px; color:#ffffff; font-size:16px; font-weight:400; text-decoration:none; text-align:center;">
                            Verify account
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td align="left" style="padding-top:40px;">
            <p style="margin:0; color:#ffffff; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-align:left;">
                If clicking doesn't work, you can try copying and pasting it to your browser:
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
