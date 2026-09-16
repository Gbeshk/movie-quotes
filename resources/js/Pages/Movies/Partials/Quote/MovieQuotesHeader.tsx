import Button from '@/Components/Shared/Button';
import PlusIcon from '@/Components/Shared/Icons/PlusIcon';
import { cn } from '@/lib/cn';
import { useTranslation } from 'react-i18next';

export default function MovieQuotesHeader({
    quotesCount,
    isOwner,
    onAddQuote,
}: {
    quotesCount: number;
    isOwner: boolean;
    onAddQuote: () => void;
}) {
    const { t, i18n } = useTranslation();

    return (
        <div className="mt-8 flex items-center gap-4">
            <p className="text-2xl font-normal text-white uppercase">
                {t('movies.quotesTotal', { count: quotesCount })}
            </p>
            {isOwner && (
                <>
                    <div className="bg-modal-secondary-text h-6.5 w-px"></div>
                    <Button
                        type="button"
                        variant="danger-cta"
                        onClick={onAddQuote}
                        className={cn(
                            'h-12 w-38.5! leading-normal font-normal tracking-normal',
                            i18n.language === 'ka' ? 'text-base' : 'text-xl',
                        )}
                    >
                        <PlusIcon />
                        {t('movies.addQuote')}
                    </Button>
                </>
            )}
        </div>
    );
}
