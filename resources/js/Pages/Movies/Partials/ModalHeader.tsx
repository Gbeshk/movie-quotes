import CloseIcon from '@/Components/Shared/Icons/CloseIcon';
import { cn } from '@/lib/cn';

export default function ModalHeader({
    title,
    onClose,
    titleClassName,
    dividerClassName,
}: {
    title: string;
    onClose: () => void;
    titleClassName?: string;
    dividerClassName?: string;
}) {
    return (
        <>
            <button
                type="button"
                onClick={onClose}
                className="absolute top-10 right-8 cursor-pointer"
            >
                <CloseIcon />
            </button>
            <p
                className={cn(
                    'px-8 text-2xl leading-normal font-medium tracking-normal text-white capitalize',
                    titleClassName,
                )}
            >
                {title}
            </p>
            <div className={cn('bg-add-movie-line mt-6 h-px w-full shrink-0', dividerClassName)} />
        </>
    );
}
