import { TouchEvent, useRef } from 'react';

const SWIPE_THRESHOLD = 50;

export function useSwipeToClose(onClose: () => void) {
    const touchStartX = useRef<number | null>(null);

    const onTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
        if (touchStartX.current === null) {
            return;
        }

        const deltaX = e.changedTouches[0].clientX - touchStartX.current;

        if (deltaX < -SWIPE_THRESHOLD) {
            onClose();
        }

        touchStartX.current = null;
    };

    return { onTouchStart, onTouchEnd };
}
