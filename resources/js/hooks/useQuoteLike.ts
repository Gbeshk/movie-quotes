import { Quote } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function useQuoteLike(quote: Quote) {
    const [liked, setLiked] = useState(quote.is_liked_by_me ?? false);
    const [likesCount, setLikesCount] = useState(quote.likes_count ?? 0);

    const toggleLike = () => {
        const wasLiked = liked;

        setLiked(!wasLiked);
        setLikesCount((count) => count + (wasLiked ? -1 : 1));

        router.post(
            route('quotes.likes.toggle', quote.id),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                except: ['quotes', 'movieOptions'],
                onError: () => {
                    setLiked(wasLiked);
                    setLikesCount((count) => count + (wasLiked ? 1 : -1));
                },
            },
        );
    };

    return { liked, likesCount, setLikesCount, toggleLike };
}
