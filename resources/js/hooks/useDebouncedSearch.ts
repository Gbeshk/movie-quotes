import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export function useDebouncedSearch(
    initialSearch: string,
    routeName: string,
    reloadOptions?: { only?: string[]; reset?: string[] },
) {
    const [search, setSearch] = useState(initialSearch);
    const isFirstRender = useRef(true);
    const config = useRef({ routeName, reloadOptions });

    useEffect(() => {
        config.current = { routeName, reloadOptions };
    });

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(route(config.current.routeName), search ? { filter: { search } } : {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                ...config.current.reloadOptions,
            });
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    return { search, setSearch };
}
