import { useTranslation } from 'react-i18next';

export default function ReadOnlyFieldRow({
    label,
    value,
    editing,
    onToggle,
    hideToggle = false,
}: {
    label: string;
    value: string;
    editing: boolean;
    onToggle: () => void;
    hideToggle?: boolean;
}) {
    const { t } = useTranslation();

    return (
        <div className="max-sm:border-input-bg/50 max-sm:border-b max-sm:pb-6">
            <label className="text-base leading-relaxed font-normal tracking-normal text-white">
                {label}
            </label>
            <div className="mt-2 flex items-center">
                <input
                    type="text"
                    readOnly
                    value={value}
                    className="bg-input-bg text-input-text max-sm:text-input-bg h-12 w-full rounded border-none px-3 text-base outline-none focus:border-none focus:ring-0 focus:outline-none max-sm:h-6 max-sm:flex-1 max-sm:bg-transparent max-sm:px-0 max-sm:text-lg"
                />
                {hideToggle ? (
                    <div className="ml-4 h-12 w-17.25 shrink-0 max-sm:h-6" />
                ) : (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-input-bg ml-4 flex h-12 w-17.25 shrink-0 cursor-pointer items-center justify-center text-xl leading-relaxed font-normal tracking-normal max-sm:h-6 max-sm:w-auto max-sm:justify-end max-sm:text-lg"
                    >
                        {editing ? t('common.cancel') : t('common.edit')}
                    </button>
                )}
            </div>
        </div>
    );
}
