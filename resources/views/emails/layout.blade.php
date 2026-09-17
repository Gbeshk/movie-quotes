<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
</head>
<body style="margin:0; padding:0; background-color:#000000; background-image:linear-gradient(187.16deg, #181623 0.07%, #191725 51.65%, #0d0b14 98.75%); font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000000; background-image:linear-gradient(187.16deg, #181623 0.07%, #191725 51.65%, #0d0b14 98.75%);">
        <tr>
            <td align="center" style="padding:78px 24px 60px 24px;">
                <table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0" style="max-width:720px; width:100%;">
                    <tr>
                        <td align="center">
                            <img src="{{ asset('images/emails/logo.png') }}" width="22" height="22" alt="Movie quotes" style="display:block; border:0;">
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top:8px;">
                            <p style="margin:0; color:#ddccaa; font-size:12px; font-weight:500; line-height:1.625; letter-spacing:normal; text-transform:uppercase; text-align:center;">
                                Movie quotes
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-top:76px;">
                            <p style="margin:0; color:#ffffff; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-align:left;">
                                Hi {{ $username }}!
                            </p>
                        </td>
                    </tr>
                    @yield('content')
                    <tr>
                        <td align="left" style="padding-top:40px;">
                            <p style="margin:0; color:#ffffff; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-align:left;">
                                If you have any problems, please contact us:
                                <a href="mailto:support@moviequotes.ge" style="color:#ffffff; text-decoration:none;">support@moviequotes.ge</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="left" style="padding-top:24px; padding-bottom:16px;">
                            <p style="margin:0; color:#ffffff; font-size:16px; font-weight:400; line-height:1.625; letter-spacing:normal; text-align:left;">
                                MovieQuotes Crew
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
