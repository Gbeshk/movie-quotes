import { cn } from '@/lib/cn';

export default function Textarea({
    id,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    className,
    heightClassName = 'h-21',
    maxLength,
}: {
    id: string;
    name: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    className?: string;
    heightClassName?: string;
    maxLength?: number;
}) {
    return (
        <textarea
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            maxLength={maxLength}
            className={cn(
                'm-0 resize-y appearance-none border-0 bg-transparent p-0 text-xl leading-6 font-normal tracking-normal text-white outline-none focus:border-0 focus:shadow-none focus:ring-0 max-sm:text-base',
                heightClassName,
                className,
            )}
        />
    );
}
