import ClampText from '@/Components/Shared/ClampText';
import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';

export default function MovieDirector({
    director,
    expanded,
    onClampChange,
    className,
}: {
    director: string;
    expanded?: boolean;
    onClampChange?: (isClamped: boolean) => void;
    className?: string;
}) {
    const { t } = useTranslation();
    const content = (
        <>
            {t('movies.director')} <span className="text-white">{director}</span>
        </>
    );

    if (!onClampChange) {
        return (
            <p className={cn('text-input-bg text-lg font-bold wrap-break-word', className)}>
                {content}
            </p>
        );
    }

    return (
        <ClampText
            axis="width"
            expanded={expanded}
            onClampChange={onClampChange}
            className={cn('text-input-bg text-lg font-bold wrap-break-word', className)}
        >
            {content}
        </ClampText>
    );
}
