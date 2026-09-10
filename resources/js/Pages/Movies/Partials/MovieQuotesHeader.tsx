import Button from '@/Components/Shared/Button';
import PlusIcon from '@/Components/Shared/Icons/PlusIcon';

export default function MovieQuotesHeader({ quotesCount }: { quotesCount: number }) {
    return (
        <div className="mt-8 flex items-center gap-4">
            <p className="text-2xl font-normal text-white uppercase">
                Quotes (total {quotesCount})
            </p>
            <div className="bg-modal-secondary-text h-6.5 w-px"></div>
            <Button
                type="button"
                variant="danger-cta"
                className="h-12 w-38.5! text-xl leading-normal font-normal tracking-normal"
            >
                <PlusIcon />
                Add quote
            </Button>
        </div>
    );
}
