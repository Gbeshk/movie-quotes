import BackIcon from '@/Components/Shared/Icons/BackIcon';
import Modal from '@/Components/Shared/Modal';
import { renderSearchPlaceholder } from '@/Components/Shared/renderSearchPlaceholder';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SearchModal({
    show,
    onClose,
    search,
    onSearchChange,
}: {
    show: boolean;
    onClose: () => void;
    search: string;
    onSearchChange: (value: string) => void;
}) {
    const { t } = useTranslation();
    const [draft, setDraft] = useState(search);
    const [wasShown, setWasShown] = useState(show);

    if (show !== wasShown) {
        setWasShown(show);

        if (show) {
            setDraft(search);
        }
    }

    const confirm = () => {
        onSearchChange(draft);
        onClose();
    };

    const clear = () => {
        onSearchChange('');
        onClose();
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            cardClassName="w-full h-4/5 rounded-none p-0"
            cardBgClassName="bg-profile-modal-bg"
            contentClassName="h-screen items-start justify-center"
        >
            <div className="border-line flex h-16 w-full items-center gap-6 border-b pr-8 pl-8">
                <button type="button" onClick={onClose} className="shrink-0 cursor-pointer">
                    <BackIcon />
                </button>
                <input
                    type="text"
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && confirm()}
                    placeholder={t('common.search')}
                    className="min-w-0 flex-1 border-none bg-transparent p-0 text-base leading-normal font-normal tracking-normal text-white outline-none placeholder:text-white focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {draft.trim() !== '' && (
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={clear}
                            className="border-modal-secondary-text cursor-pointer rounded-lg border px-3 py-1.5 text-sm leading-normal font-normal tracking-normal text-white"
                        >
                            {t('common.clearSearch')}
                        </button>
                        <button
                            type="button"
                            onClick={confirm}
                            className="bg-danger hover:bg-sign-up-btn-hover active:bg-sign-up-btn-active cursor-pointer rounded-lg px-3 py-1.5 text-sm leading-normal font-normal tracking-normal text-white transition-colors duration-150"
                        >
                            {t('common.search')}
                        </button>
                    </div>
                )}
            </div>
            <div className="text-input-bg mt-6 flex w-full flex-col gap-4 pr-8 pl-18 text-base leading-normal font-normal tracking-normal">
                <p>{renderSearchPlaceholder(t('common.searchHintMovies'))}</p>
                <p>{renderSearchPlaceholder(t('common.searchHintQuotes'))}</p>
            </div>
        </Modal>
    );
}
