import Header from '@/Components/Shared/Header';
import LoginModal from '@/Components/Welcome/LoginModal';
import QuoteSequence from '@/Components/Welcome/QuoteSequence';
import RegisterModal from '@/Components/Welcome/RegisterModal';
import VerifyEmailModal from '@/Components/Welcome/VerifyEmailModal';
import { PageProps, WelcomeQuote } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ quotes }: { quotes: WelcomeQuote[] }) {
    const { auth } = usePage<PageProps>().props;
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
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
            <div>
                <Header
                    background="bg-black"
                    onOpenLogin={() => setShowLogin(true)}
                    onOpenRegister={() => setShowRegister(true)}
                />

                <div className="flex h-180 w-full flex-col items-center justify-center gap-6 bg-black">
                    <p className="text-logo-text font-montserrat text-center text-6xl leading-normal font-bold tracking-normal">
                        Find any quote in <br /> millions of movie lines
                    </p>
                    <button
                        onClick={() =>
                            auth.user ? router.visit(route('feed')) : setShowLogin(true)
                        }
                        className="bg-sign-up-btn-bg flex cursor-pointer items-center justify-center rounded px-4.25 py-2.25 text-base leading-normal font-normal tracking-normal text-white"
                    >
                        Get started
                    </button>
                </div>
                <QuoteSequence quotes={quotes} />
                <div className="bg-gradient-dark text-logo-text flex h-12 items-center px-17.5 text-xs leading-normal font-medium tracking-normal uppercase">
                    © 2022 movie quotes. All rights reserved.
                </div>
            </div>

            <LoginModal
                show={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
                onUnverified={(email, password) => {
                    setShowLogin(false);
                    setBlockedVerification({ email, password });
                }}
            />
            <RegisterModal
                show={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
            <VerifyEmailModal
                show={showVerifyEmail}
                onClose={closeVerifyEmail}
                resendCredentials={blockedVerification ?? undefined}
            />
        </>
    );
}
