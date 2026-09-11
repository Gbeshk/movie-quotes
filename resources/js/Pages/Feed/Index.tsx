import AddPostIcon from '@/Components/Shared/Icons/AddPostIcon';
import SearchIcon from '@/Components/Shared/Icons/SearchIcon';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AddQuoteModal from '@/Pages/Feed/Partials/AddQuoteModal';
import Post from '@/Pages/Feed/Partials/Post';
import { Paginated, Quote } from '@/types';
import { Head, InfiniteScroll } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ quotes }: { quotes: Paginated<Quote> }) {
    const [showAddQuote, setShowAddQuote] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="News Feed" />
            <AddQuoteModal show={showAddQuote} onClose={() => setShowAddQuote(false)} />
            <div className="flex h-13 w-3/4 items-center justify-between">
                <button
                    type="button"
                    onClick={() => setShowAddQuote(true)}
                    className="bg-header-bg/60 flex h-full w-5/6 shrink-0 cursor-pointer items-center gap-4 rounded-xl px-4"
                >
                    <AddPostIcon />
                    <p className="text-xl leading-normal text-white">Write new quote</p>
                </button>
                <div className="flex min-w-0 shrink items-center gap-4">
                    <SearchIcon />
                    <input
                        type="text"
                        placeholder="Search"
                        className="text-input-bg placeholder:text-input-bg w-24 min-w-0 shrink border-none bg-transparent p-0 text-xl leading-normal font-normal tracking-normal outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
            </div>
            <InfiniteScroll
                data="quotes"
                className="mt-5.5 flex w-3/4 flex-col gap-10"
                next={({ hasNext }) =>
                    !hasNext && (
                        <p className="text-modal-secondary-text py-6 text-center text-base leading-normal font-normal tracking-normal">
                            No more posts
                        </p>
                    )
                }
            >
                {quotes.data.map((quote) => (
                    <Post key={quote.id} quote={quote} />
                ))}
            </InfiniteScroll>
        </AuthenticatedLayout>
    );
}
