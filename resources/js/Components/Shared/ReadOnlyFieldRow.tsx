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
        <>
            <label className="text-base leading-relaxed font-normal tracking-normal text-white">
                {label}
            </label>
            <div className="mt-2 flex items-center">
                <input
                    type="text"
                    readOnly
                    value={value}
                    className="bg-input-bg text-input-text h-12 w-full rounded px-3"
                />
                {hideToggle ? (
                    <div className="ml-4 h-12 w-17.25 shrink-0" />
                ) : (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-input-bg ml-4 flex h-12 w-17.25 shrink-0 cursor-pointer items-center justify-center text-xl leading-relaxed font-normal tracking-normal"
                    >
                        {editing ? t('common.cancel') : t('common.edit')}
                    </button>
                )}
            </div>
        </>
    );
}
