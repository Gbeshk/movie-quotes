import AuthGoogleButton from '@/Components/Welcome/AuthGoogleButton';
import AuthField from '@/Components/Welcome/AuthField';
import AuthModal from '@/Components/Welcome/AuthModal';
import { isValidEmail, isValidPassword, isValidUsername } from '@/lib/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function RegisterModal({
    show,
    onClose,
    onSwitchToLogin,
}: {
    show: boolean;
    onClose: () => void;
    onSwitchToLogin: () => void;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthModal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title="Create an account"
            subtitle="Start your journey!"
        >
            <div className="mt-6 w-full space-y-4">
                <AuthField
                    label="Name"
                    id="register_username"
                    placeholder="At least 3 & max.15 lower case characters"
                    value={data.username}
                    onChange={(value) => setData('username', value)}
                    error={errors.username}
                    validate={isValidUsername}
                    autoComplete="username"
                />

                <AuthField
                    label="Email"
                    id="register_email"
                    type="text"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    validate={isValidEmail}
                    autoComplete="email"
                />

                <AuthField
                    label="Password"
                    id="register_password"
                    type="password"
                    placeholder="At least 8 & max.15 lower case characters"
                    value={data.password}
                    onChange={(value) => setData('password', value)}
                    error={errors.password}
                    validate={isValidPassword}
                    autoComplete="new-password"
                />

                <AuthField
                    label="Confirm password"
                    id="register_password_confirmation"
                    type="password"
                    placeholder="Confirm password"
                    value={data.password_confirmation}
                    onChange={(value) => setData('password_confirmation', value)}
                    error={errors.password_confirmation}
                    validate={(value) => value.length > 0 && value === data.password}
                    autoComplete="new-password"
                />
            </div>

            <button
                type="submit"
                disabled={processing}
                className="bg-sign-up-btn-bg hover:bg-sign-up-btn-hover active:bg-sign-up-btn-active mt-6 h-9.5 w-full cursor-pointer rounded text-base text-white disabled:opacity-50"
            >
                Get started
            </button>
            <AuthGoogleButton label="Sign up with Google" />
            <p className="text-modal-secondary-text mt-8 text-base">
                Already have an account?{' '}
                <span onClick={onSwitchToLogin} className="text-link-text cursor-pointer underline">
                    Log in
                </span>
            </p>
        </AuthModal>
    );
}
