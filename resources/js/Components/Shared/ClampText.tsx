import { cn } from '@/lib/cn';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

function useClampDetection(axis: 'height' | 'width', enabled: boolean) {
    const ref = useRef<HTMLParagraphElement>(null);
    const [isClamped, setIsClamped] = useState(false);

    useLayoutEffect(() => {
        const el = ref.current;

        if (!enabled || !el) {
            return;
        }

        const measure = () =>
            setIsClamped(
                axis === 'height'
                    ? el.scrollHeight > el.clientHeight
                    : el.scrollWidth > el.clientWidth,
            );

        measure();
        document.fonts?.ready.then(measure);

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(el);

        return () => resizeObserver.disconnect();
    }, [axis, enabled]);

    return { ref, isClamped };
}

export default function ClampText({
    children,
    axis = 'height',
    className,
    clamp = true,
    expanded: expandedProp,
    onExpandedChange,
    onClampChange,
    moreLabel,
    lessLabel,
    buttonClassName,
}: {
    children: ReactNode;
    axis?: 'height' | 'width';
    className?: string;
    clamp?: boolean;
    expanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
    onClampChange?: (isClamped: boolean) => void;
    moreLabel?: string;
    lessLabel?: string;
    buttonClassName?: string;
}) {
    const { ref, isClamped } = useClampDetection(axis, clamp);
    const [internalExpanded, setInternalExpanded] = useState(false);
    const expanded = expandedProp ?? internalExpanded;

    useEffect(() => {
        onClampChange?.(isClamped);
    }, [isClamped, onClampChange]);

    if (!clamp) {
        return <p className={className}>{children}</p>;
    }

    const toggle = () => (onExpandedChange ?? setInternalExpanded)(!expanded);

    return (
        <>
            <p
                ref={ref}
                className={cn(
                    className,
                    !expanded && (axis === 'height' ? 'line-clamp-3' : 'truncate'),
                )}
            >
                {children}
            </p>
            {moreLabel && lessLabel && (isClamped || expanded) && (
                <button type="button" onClick={toggle} className={buttonClassName}>
                    {expanded ? lessLabel : moreLabel}
                </button>
            )}
        </>
    );
}
