import { useLayoutEffect, useRef, useState } from 'react';

export function useClampOverflow<T extends HTMLElement>(axis: 'height' | 'width' = 'height') {
    const ref = useRef<T>(null);
    const [isClamped, setIsClamped] = useState(false);

    useLayoutEffect(() => {
        const el = ref.current;

        if (!el) {
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
    }, [axis]);

    return { ref, isClamped };
}
