import { useTranslation } from 'react-i18next';

export default function MovieDirector({ director }: { director: string }) {
    const { t } = useTranslation();

    return (
        <p className="text-input-bg text-lg font-bold">
            {t('movies.director')} <span className="text-white">{director}</span>
        </p>
    );
}
