import AuthSwitchPrompt from '@/Components/Shared/AuthSwitchPrompt';
import Button from '@/Components/Shared/Button';
import AuthGoogleButton from '@/Components/Welcome/AuthGoogleButton';
import FormField from '@/Components/Shared/FormField';
import Modal from '@/Components/Shared/Modal';
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirmation,
    validateUsername,
} from '@/lib/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

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
    const [passwordFieldsKey, setPasswordFieldsKey] = useState(0);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
            onError: (formErrors) => {
                reset('password', 'password_confirmation');

                if (!formErrors.password) {
                    setPasswordFieldsKey((key) => key + 1);
                }
            },
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title="Create an account"
            subtitle="Start your journey!"
        >
            <div className="mt-6 w-full space-y-4">
                <FormField
                    label="Name"
                    id="register_username"
                    placeholder="At least 3 & max.15 lower case characters"
                    value={data.username}
                    onChange={(value) => setData('username', value)}
                    error={errors.username}
                    validate={validateUsername}
                    autoComplete="username"
                />

                <FormField
                    label="Email"
                    id="register_email"
                    type="text"
                    placeholder="Enter your email"
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    validate={validateEmail}
                    autoComplete="email"
                />

                <FormField
                    key={`password-${passwordFieldsKey}`}
                    label="Password"
                    id="register_password"
                    type="password"
                    placeholder="At least 8 & max.15 lower case characters"
                    value={data.password}
                    onChange={(value) => setData('password', value)}
                    error={errors.password}
                    validate={validatePassword}
                    autoComplete="new-password"
                />

                <FormField
                    key={`password-confirmation-${passwordFieldsKey}`}
                    label="Confirm password"
                    id="register_password_confirmation"
                    type="password"
                    placeholder="Confirm password"
                    value={data.password_confirmation}
                    onChange={(value) => setData('password_confirmation', value)}
                    error={errors.password_confirmation}
                    validate={validatePasswordConfirmation(data.password)}
                    autoComplete="new-password"
                />
            </div>

            <Button type="submit" variant="cta" disabled={processing} className="mt-6">
                Get started
            </Button>
            <AuthGoogleButton label="Sign up with Google" />
            <AuthSwitchPrompt
                prompt="Already have an account?"
                actionLabel="Log in"
                onAction={onSwitchToLogin}
            />
        </Modal>
    );
}
