import Button from '@/Components/Shared/Button';
import { Head, router } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export default function ErrorLayout({
    title,
    heading,
    description,
    children,
}: PropsWithChildren<{
    title: string;
    heading: string;
    description: string;
}>) {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-dark flex min-h-screen flex-col items-center justify-center bg-black">
            <Head title={title} />
            {children}
            <p className="mt-7 text-5xl leading-relaxed font-bold tracking-normal text-white">
                {heading}
            </p>
            <p className="text-modal-secondary-text mt-2 text-2xl leading-relaxed font-medium tracking-normal">
                {description}
            </p>
            <Button
                variant="danger-cta"
                className="mt-12 h-12! w-37.5!"
                onClick={() => router.visit(route('welcome'))}
            >
                {t('errors.returnHome')}
            </Button>
        </div>
    );
}
