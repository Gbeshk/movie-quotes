import ErrorIllustrationIcon from '@/Components/Shared/Icons/ErrorIllustrationIcon';
import ErrorShadowIcon from '@/Components/Shared/Icons/ErrorShadowIcon';
import ErrorLayout from '@/Layouts/ErrorLayout';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <ErrorLayout
            title={t('errors.notFoundTitle')}
            heading={t('errors.notFoundTitle')}
            description={t('errors.notFoundDescription')}
        >
            <ErrorIllustrationIcon />
            <ErrorShadowIcon className="mt-7" />
        </ErrorLayout>
    );
}
