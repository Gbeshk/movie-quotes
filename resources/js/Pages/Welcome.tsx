import Header from '@/Components/Shared/Header';
import EmailVerifiedModal from '@/Components/Welcome/EmailVerifiedModal';
import ForgotPasswordModal from '@/Components/Welcome/ForgotPasswordModal';
import LoginModal from '@/Components/Welcome/LoginModal';
import QuoteSequence from '@/Components/Welcome/QuoteSequence';
import RegisterModal from '@/Components/Welcome/RegisterModal';
import ResetPasswordModal from '@/Components/Welcome/ResetPasswordModal';
import VerifyEmailModal from '@/Components/Welcome/VerifyEmailModal';
import { PageProps, WelcomeQuote } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Welcome({
    quotes,
    resetPasswordToken,
    resetPasswordEmail,
    resetTokenExpired,
    emailJustVerified,
}: {
    quotes: WelcomeQuote[];
    resetPasswordToken: string | null;
    resetPasswordEmail: string | null;
    resetTokenExpired: boolean;
    emailJustVerified: boolean;
}) {
    const { auth, unreadNotificationsCount } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(Boolean(resetPasswordToken));
    const [showEmailVerified, setShowEmailVerified] = useState(emailJustVerified);

    useEffect(() => {
        if (resetPasswordToken || emailJustVerified) {
            window.history.replaceState({}, '', route('welcome'));
        }
    }, [resetPasswordToken, emailJustVerified]);
    const [verifyEmailDismissed, setVerifyEmailDismissed] = useState(false);
    const [blockedVerification, setBlockedVerification] = useState<{
        email: string;
        password: string;
    } | null>(null);
    const showVerifyEmail =
        (!verifyEmailDismissed && Boolean(auth.user && !auth.user.email_verified_at)) ||
        blockedVerification !== null;

    const closeVerifyEmail = () => {
        setVerifyEmailDismissed(true);
        setBlockedVerification(null);
    };

    return (
        <>
            <Head title={t('header.logoText')} />
            <div>
                <div className="bg-gradient-fade bg-black">
                    <Header
                        background="bg-transparent"
                        onOpenLogin={() => setShowLogin(true)}
                        onOpenRegister={() => setShowRegister(true)}
                        unreadNotificationsCount={unreadNotificationsCount}
                    />

                    <div className="flex h-180 w-full flex-col items-center justify-center gap-6 max-sm:h-88 max-sm:gap-8">
                        <p className="text-logo-text font-montserrat text-center text-6xl leading-normal font-bold tracking-normal max-sm:text-2xl">
                            {t('welcome.heading')
                                .split('\n')
                                .map((line, index, lines) => (
                                    <Fragment key={line}>
                                        {line}
                                        {index < lines.length - 1 && <br />}
                                    </Fragment>
                                ))}
                        </p>
                        <button
                            onClick={() =>
                                auth.user ? router.visit(route('feed')) : setShowLogin(true)
                            }
                            className="bg-sign-up-btn-bg flex h-12 w-33.25 cursor-pointer items-center justify-center rounded px-4.25 py-2.25 text-base leading-normal font-normal tracking-normal text-white max-sm:h-9.5 max-sm:w-27.25 max-sm:px-2 max-sm:whitespace-nowrap"
                        >
                            {t('welcome.getStarted')}
                        </button>
                    </div>
                </div>
                <QuoteSequence quotes={quotes} />
                <div className="bg-gradient-dark text-logo-text max-sm:text-tiny flex h-12 items-center px-17.5 text-xs leading-normal font-medium tracking-normal uppercase max-sm:px-0 max-sm:pl-8">
                    {t('welcome.copyright')}
                </div>
            </div>

            <LoginModal
                show={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
                onForgotPassword={() => {
                    setShowLogin(false);
                    setShowForgotPassword(true);
                }}
            />
            <ForgotPasswordModal
                show={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
                onBackToLogin={() => {
                    setShowForgotPassword(false);
                    setShowLogin(true);
                }}
            />
            <ResetPasswordModal
                show={showResetPassword}
                onClose={() => setShowResetPassword(false)}
                onBackToLogin={() => {
                    setShowResetPassword(false);
                    setShowLogin(true);
                }}
                onSuccess={() => {
                    setShowResetPassword(false);
                    setShowLogin(true);
                }}
                onRequestNewLink={() => {
                    setShowResetPassword(false);
                    setShowForgotPassword(true);
                }}
                token={resetPasswordToken ?? ''}
                email={resetPasswordEmail ?? ''}
                initiallyExpired={resetTokenExpired}
            />
            <RegisterModal
                show={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
                onUnverified={(email, password) => {
                    setShowRegister(false);
                    setBlockedVerification({ email, password });
                }}
            />
            <VerifyEmailModal
                show={showVerifyEmail}
                onClose={closeVerifyEmail}
                resendCredentials={blockedVerification ?? undefined}
            />
            <EmailVerifiedModal
                show={showEmailVerified}
                onClose={() => setShowEmailVerified(false)}
            />
        </>
    );
}
