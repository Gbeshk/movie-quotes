import AuthSwitchPrompt from '@/Components/Shared/AuthSwitchPrompt';
import Button from '@/Components/Shared/Button';
import Checkbox from '@/Components/Shared/Checkbox';
import AuthGoogleButton from '@/Components/Welcome/AuthGoogleButton';
import FormField from '@/Components/Shared/FormField';
import Modal from '@/Components/Shared/Modal';
import { validateEmail } from '@/lib/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function LoginModal({
    show,
    onClose,
    onSwitchToRegister,
    onUnverified,
}: {
    show: boolean;
    onClose: () => void;
    onSwitchToRegister: () => void;
    onUnverified: (email: string, password: string) => void;
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
            onError: (formErrors) => {
                if ('verification' in formErrors) {
                    onUnverified(data.email, data.password);
                } else {
                    reset('password');
                }
            },
        });
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

            <div className="mt-4 flex w-full items-center justify-between">
                <Checkbox
                    checked={data.remember}
                    onChange={(checked) => setData('remember', checked)}
                    label="Remember me"
                />
                <p className="text-link-text cursor-pointer text-base underline">Forgot password</p>
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
