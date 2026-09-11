import CloseIcon from '@/Components/Shared/Icons/CloseIcon';

export default function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
    return (
        <>
            <button
                type="button"
                onClick={onClose}
                className="absolute top-10 right-8 cursor-pointer"
            >
                <CloseIcon />
            </button>
            <p className="px-8 text-2xl leading-normal font-medium tracking-normal text-white capitalize">
                {title}
            </p>
            <div className="bg-add-movie-line mt-6 h-px w-full shrink-0"></div>
        </>
    );
}
