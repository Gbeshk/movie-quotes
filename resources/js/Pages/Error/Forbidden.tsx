import ForbiddenIllustrationIcon from '@/Components/Shared/Icons/ForbiddenIllustrationIcon';
import ErrorLayout from '@/Layouts/ErrorLayout';
import { useTranslation } from 'react-i18next';

export default function Forbidden() {
    const { t } = useTranslation();

    return (
        <ErrorLayout
            title={t('errors.forbiddenTitle')}
            heading={t('errors.forbiddenTitle')}
            description={t('errors.forbiddenDescription')}
        >
            <ForbiddenIllustrationIcon />
        </ErrorLayout>
    );
}
