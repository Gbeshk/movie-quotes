import Button from '@/Components/Shared/Button';
import FormField from '@/Components/Shared/FormField';
import ArrowLeftIcon from '@/Components/Shared/Icons/ArrowLeftIcon';
import CheckCircleIcon from '@/Components/Shared/Icons/CheckCircleIcon';
import LinkExpiredIcon from '@/Components/Shared/Icons/LinkExpiredIcon';
import Modal from '@/Components/Shared/Modal';
import { validateNewPassword, validatePasswordConfirmation } from '@/lib/validators';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function ResetPasswordModal({
    show,
    onClose,
    onBackToLogin,
    onSuccess,
    onRequestNewLink,
    token,
    email,
    initiallyExpired,
}: {
    show: boolean;
    onClose: () => void;
    onBackToLogin: () => void;
    onSuccess: () => void;
    onRequestNewLink: () => void;
    token: string;
    email: string;
    initiallyExpired: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const [expired, setExpired] = useState(initiallyExpired);
    const [changed, setChanged] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        setExpired(false);

        post(route('password.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setChanged(true);
            },
            onError: () => setExpired(true),
        });
    };

    if (changed) {
        return (
            <Modal show={show} onClose={onClose} cardClassName="w-full max-w-134.5 px-22 py-18">
                <CheckCircleIcon />
                <h2 className="mt-5 text-3xl leading-[1.2] font-medium tracking-normal text-white">
                    Success!
                </h2>
                <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                    Your password changed successfully
                </h3>
                <Button type="button" variant="cta" onClick={onSuccess} className="mt-6">
                    Log in
                </Button>
            </Modal>
        );
    }

    if (expired) {
        return (
            <Modal show={show} onClose={onClose} cardClassName="w-full max-w-137 px-22 py-18">
                <LinkExpiredIcon />
                <h2 className="mt-5 text-3xl leading-[1.2] font-medium tracking-normal text-white">
                    Link expired!
                </h2>
                <h3 className="mt-8 w-full text-center text-base leading-normal font-normal text-white">
                    Login link has expired, because you haven’t used it
                </h3>
                <Button type="button" variant="cta" onClick={onRequestNewLink} className="mt-6">
                    Request another link
                </Button>
            </Modal>
        );
    }

    return (
        <Modal
            show={show}
            onClose={onClose}
            onSubmit={submit}
            title="Create new password"
            subtitle="Your new password must be different from previously used passwords"
        >
            <div className="mt-6 w-full space-y-4">
                <FormField
                    label="New password"
                    id="reset_password_password"
                    type="password"
                    placeholder="Enter new password"
                    value={data.password}
                    onChange={(value) => setData('password', value)}
                    error={errors.password}
                    validate={validateNewPassword}
                    autoComplete="new-password"
                />

                <FormField
                    label="Confirm new password"
                    id="reset_password_password_confirmation"
                    type="password"
                    placeholder="Confirm new password"
                    value={data.password_confirmation}
                    onChange={(value) => setData('password_confirmation', value)}
                    error={errors.password_confirmation}
                    validate={validatePasswordConfirmation(data.password)}
                    autoComplete="new-password"
                />
            </div>
            <Button type="submit" variant="cta" disabled={processing} className="mt-4">
                Reset password
            </Button>
            <button
                type="button"
                onClick={onBackToLogin}
                className="text-modal-secondary-text mt-8 flex cursor-pointer items-center gap-2 text-base"
            >
                <ArrowLeftIcon />
                Back to log in
            </button>
        </Modal>
    );
}
