import { cn } from '@/lib/cn';

export default function Checkbox({
    checked,
    onChange,
    label,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2">
            <div
                role="checkbox"
                aria-checked={checked}
                tabIndex={0}
                onClick={() => onChange(!checked)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onChange(!checked);
                    }
                }}
                className={cn(
                    'flex h-4 w-4 cursor-pointer items-center justify-center rounded border transition-colors',
                    checked ? 'bg-link-text border-link-text' : 'border-input-bg bg-white',
                )}
            >
                {checked && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </div>
            <p className="text-base leading-normal font-normal tracking-normal text-white">
                {label}
            </p>
        </label>
    );
}
