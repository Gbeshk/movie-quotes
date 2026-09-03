import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MovieGrid from '@/Components/Shared/MovieGrid';
import { Movie } from '@/types';
import { Head } from '@inertiajs/react';

export default function Index({ movies }: { movies: Movie[] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">News Feed</h2>
            }
        >
            <Head title="News Feed" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <MovieGrid
                        movies={movies}
                        emptyMessage="No movies have been added yet."
                        showAuthor
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
