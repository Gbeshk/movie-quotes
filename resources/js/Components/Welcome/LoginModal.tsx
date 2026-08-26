import AuthGoogleButton from '@/Components/Welcome/AuthGoogleButton';
import AuthField from '@/Components/Welcome/AuthField';
import AuthModal from '@/Components/Welcome/AuthModal';
import { cn } from '@/lib/cn';
import { isValidEmail } from '@/lib/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function LoginModal({
    show,
    onClose,
    onSwitchToRegister,
}: {
    show: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthModal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title="Log in to your account"
            subtitle="Welcome back! Please enter your details."
        >
            <div className="mt-6 w-full space-y-4">
                <AuthField
                    label="Email"
                    id="login_email"
                    type="text"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    validate={isValidEmail}
                    autoComplete="username"
                />

                <AuthField
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
            <div className="mt-4 flex w-full items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                    <div
                        role="checkbox"
                        aria-checked={data.remember}
                        tabIndex={0}
                        onClick={() => setData('remember', !data.remember)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setData('remember', !data.remember);
                            }
                        }}
                        className={cn(
                            'h-4 w-4 cursor-pointer rounded border',
                            data.remember
                                ? 'bg-sign-up-btn-bg border-transparent'
                                : 'border-input-bg bg-white',
                        )}
                    />
                    <p className="text-base leading-normal font-normal tracking-normal text-white">
                        Remember me
                    </p>
                </label>
                <p className="text-link-text cursor-pointer text-base underline">Forgot password</p>
            </div>
            <button
                type="submit"
                disabled={processing}
                className="bg-sign-up-btn-bg mt-4 h-9.5 w-full cursor-pointer rounded text-base text-white disabled:opacity-50"
            >
                Log in
            </button>
            <AuthGoogleButton label="Log in with Google" />
            <p className="text-modal-secondary-text mt-8 text-base">
                Don&apos;t have an account?{' '}
                <span
                    onClick={onSwitchToRegister}
                    className="text-link-text cursor-pointer underline"
                >
                    Sign up
                </span>
            </p>
        </AuthModal>
    );
}
