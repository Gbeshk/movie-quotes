import GenreInput from '@/Pages/Movies/Partials/GenreInput';
import MovieField from '@/Pages/Movies/Partials/MovieField';
import MovieTextarea from '@/Pages/Movies/Partials/MovieTextarea';
import { validateEnglishText, validateGeorgianText, validateReleaseYear } from '@/lib/validators';
import { InertiaFormProps } from '@inertiajs/react';
import { MovieFormData } from '@/types';

export default function AddMovieFormFields({
    data,
    setData,
    errors,
    clearErrors,
}: Pick<InertiaFormProps<MovieFormData>, 'data' | 'setData' | 'errors' | 'clearErrors'>) {
    return (
        <>
            <MovieField
                className="mt-7"
                id="title_en"
                name="title_en"
                placeholder="Movie name"
                value={data.title.en}
                onChange={(value) => setData('title.en', value)}
                error={errors['title.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <MovieField
                className="mt-6"
                id="title_ka"
                name="title_ka"
                placeholder="ფილმის სახელი"
                value={data.title.ka}
                onChange={(value) => setData('title.ka', value)}
                error={errors['title.ka']}
                validate={validateGeorgianText}
                badge="ქარ"
            />
            <GenreInput
                genres={data.genre}
                onChange={(genres) => {
                    setData('genre', genres);
                    clearErrors('genre');
                }}
                error={errors.genre}
            />
            <MovieField
                className="mt-6"
                id="release_year"
                name="release_year"
                inputMode="numeric"
                placeholder="Year/წელი"
                value={data.release_year}
                onChange={(value) => setData('release_year', value)}
                error={errors.release_year}
                validate={validateReleaseYear}
            />
            <MovieField
                className="mt-6"
                id="director_en"
                name="director_en"
                placeholder="Director"
                value={data.director.en}
                onChange={(value) => setData('director.en', value)}
                error={errors['director.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <MovieField
                className="mt-6"
                id="director_ka"
                name="director_ka"
                placeholder="რეჟისორი"
                value={data.director.ka}
                onChange={(value) => setData('director.ka', value)}
                error={errors['director.ka']}
                validate={validateGeorgianText}
                badge="ქარ"
            />
            <MovieTextarea
                id="description_en"
                name="description_en"
                placeholder="Movie description"
                value={data.description.en}
                onChange={(value) => setData('description.en', value)}
                error={errors['description.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <MovieTextarea
                id="description_ka"
                name="description_ka"
                placeholder="ფილმის აღწერა"
                value={data.description.ka}
                onChange={(value) => setData('description.ka', value)}
                error={errors['description.ka']}
                validate={validateGeorgianText}
                badge="ქარ"
            />
        </>
    );
}
