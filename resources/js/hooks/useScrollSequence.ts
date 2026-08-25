import { useEffect, useRef, useState } from 'react';

export function useScrollSequence(steps: number) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const element = ref.current;
        if (!element || steps <= 1) return;

        let ticking = false;

        const update = () => {
            const rect = element.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const pinDuration = rect.height - viewportHeight;

            if (pinDuration <= 0) {
                setProgress(0);
                ticking = false;
                return;
            }

            const scrolled = -rect.top;
            const clamped = Math.min(Math.max(scrolled / pinDuration, 0), 1);

            setProgress(clamped * (steps - 1));
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, [steps]);

    return { ref, progress };
}
