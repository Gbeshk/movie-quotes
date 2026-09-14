import AuthSwitchPrompt from '@/Components/Shared/AuthSwitchPrompt';
import Button from '@/Components/Shared/Button';
import Checkbox from '@/Components/Shared/Checkbox';
import AuthGoogleButton from '@/Components/Welcome/AuthGoogleButton';
import FormField from '@/Components/Shared/FormField';
import Modal from '@/Components/Shared/Modal';
import { validateEmail } from '@/lib/validators';
import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function LoginModal({
    show,
    onClose,
    onSwitchToRegister,
    onForgotPassword,
}: {
    show: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
    onForgotPassword: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [unverified, setUnverified] = useState(false);
    const [resendSent, setResendSent] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (formErrors) => {
                if ('verification' in formErrors) {
                    setUnverified(true);
                    setResendSent(false);
                } else {
                    setUnverified(false);
                    reset('password');
                }
            },
        });
    };

    const resend = () => {
        router.post(
            route('verification.resend'),
            { email: data.email, password: data.password },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => setResendSent(true),
            },
        );
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title="Log in to your account"
            subtitle="Welcome back! Please enter your details."
        >
            <div className="mt-6 w-full space-y-4">
                <FormField
                    label="Email"
                    id="login_email"
                    type="text"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    validate={validateEmail}
                    autoComplete="username"
                />

                <FormField
                    label="Password"
                    id="login_password"
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(value) => setData('password', value)}
                    error={errors.password}
                    autoComplete="current-password"
                />
            </div>

            {unverified && (
                <div className="mt-4 w-full">
                    <p className="text-error-text text-sm leading-normal font-normal tracking-normal">
                        Your account is not verified yet. Please check your email or resend the
                        verification link.
                    </p>

                    {resendSent ? (
                        <p className="text-success mt-2 text-sm leading-normal font-normal tracking-normal">
                            Verification link sent, check your email.
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={resend}
                            className="text-link-text mt-2 cursor-pointer text-sm underline"
                        >
                            Resend verification email
                        </button>
                    )}
                </div>
            )}

            <div className="mt-4 flex w-full items-center justify-between">
                <Checkbox
                    checked={data.remember}
                    onChange={(checked) => setData('remember', checked)}
                    label="Remember me"
                />
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-link-text cursor-pointer text-base underline"
                >
                    Forgot password
                </button>
            </div>
            <Button type="submit" variant="cta" disabled={processing} className="mt-4">
                Log in
            </Button>
            <AuthGoogleButton label="Log in with Google" />
            <AuthSwitchPrompt
                prompt="Don't have an account?"
                actionLabel="Sign up"
                onAction={onSwitchToRegister}
            />
        </Modal>
    );
}
