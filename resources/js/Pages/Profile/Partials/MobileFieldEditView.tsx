import BackArrowIcon from '@/Components/Shared/Icons/BackArrowIcon';
import { ReactNode } from 'react';

export default function MobileFieldEditView({
    onBack,
    children,
}: {
    onBack: () => void;
    children: ReactNode;
}) {
    return (
        <div className="bg-header-bg relative -mx-8 mt-16 flex flex-col rounded-xl px-6 pt-6 pb-16 md:hidden">
            <button
                type="button"
                onClick={onBack}
                className="absolute -top-12 left-7 cursor-pointer"
            >
                <BackArrowIcon />
            </button>

            {children}
        </div>
    );
}
