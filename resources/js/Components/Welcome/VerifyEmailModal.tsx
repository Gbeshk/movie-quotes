import Button from '@/Components/Shared/Button';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import EmailSentIcon from '../Shared/Icons/EmailSentIcon';

export default function VerifyEmailModal({
    show,
    onClose,
    resendCredentials,
}: {
    show: boolean;
    onClose: () => void;
    resendCredentials?: { email: string; password: string };
}) {
    const [resendSent, setResendSent] = useState(false);
    const [previousShow, setPreviousShow] = useState(show);

    if (show !== previousShow) {
        setPreviousShow(show);

        if (show) {
            setResendSent(false);
        }
    }

    if (!show) {
        return null;
    }

    const resend = () => {
        const url = resendCredentials ? route('verification.resend') : route('verification.send');

        router.post(url, resendCredentials ?? {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setResendSent(true),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/54 backdrop-blur-xs">
            <div className="fixed inset-0 w-full" onClick={onClose} />

            <div className="bg-modal-bg relative z-10 flex w-full max-w-134.5 flex-col items-center rounded-lg px-22 py-18">
                <EmailSentIcon />
                <h2 className="mt-5 text-3xl leading-[1.2] font-medium tracking-normal text-white">
                    Thank you!
                </h2>
                <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                    Please check your email and follow the instructions to activate your account.
                </h3>
                <Button type="button" variant="cta" className="mt-6">
                    Go to my email
                </Button>

                {resendSent ? (
                    <p className="text-success mt-4 text-base leading-normal font-normal tracking-normal">
                        Verification link sent, check your email.
                    </p>
                ) : (
                    <button
                        type="button"
                        onClick={resend}
                        className="text-link-text mt-4 cursor-pointer text-base underline"
                    >
                        Resend verification email
                    </button>
                )}
            </div>
        </div>
    );
}
