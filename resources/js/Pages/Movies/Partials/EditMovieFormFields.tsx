import GenreInput from '@/Pages/Movies/Partials/GenreInput';
import LabeledMovieField from '@/Pages/Movies/Partials/LabeledMovieField';
import LabeledMovieTextarea from '@/Pages/Movies/Partials/LabeledMovieTextarea';
import { validateEnglishText, validateGeorgianText, validateReleaseYear } from '@/lib/validators';
import { InertiaFormProps } from '@inertiajs/react';
import { MovieFormData } from '@/types';

export default function EditMovieFormFields({
    data,
    setData,
    errors,
    clearErrors,
}: Pick<InertiaFormProps<MovieFormData>, 'data' | 'setData' | 'errors' | 'clearErrors'>) {
    return (
        <>
            <LabeledMovieField
                className="mt-7"
                id="edit_title_en"
                name="title_en"
                label="Movie name:"
                value={data.title.en}
                onChange={(value) => setData('title.en', value)}
                error={errors['title.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <LabeledMovieField
                className="mt-6"
                id="edit_title_ka"
                name="title_ka"
                label="ფილმის სახელი:"
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
            <LabeledMovieField
                className="mt-6"
                id="edit_release_year"
                name="release_year"
                label="Year/წელი:"
                inputMode="numeric"
                value={data.release_year}
                onChange={(value) => setData('release_year', value)}
                error={errors.release_year}
                validate={validateReleaseYear}
            />
            <LabeledMovieField
                className="mt-6"
                id="edit_director_en"
                name="director_en"
                label="Director:"
                value={data.director.en}
                onChange={(value) => setData('director.en', value)}
                error={errors['director.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <LabeledMovieField
                className="mt-6"
                id="edit_director_ka"
                name="director_ka"
                label="რეჟისორი:"
                value={data.director.ka}
                onChange={(value) => setData('director.ka', value)}
                error={errors['director.ka']}
                validate={validateGeorgianText}
                badge="ქარ"
            />
            <LabeledMovieTextarea
                id="edit_description_en"
                name="description_en"
                label="Movie description:"
                value={data.description.en}
                onChange={(value) => setData('description.en', value)}
                error={errors['description.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <LabeledMovieTextarea
                id="edit_description_ka"
                name="description_ka"
                label="ფილმის აღწერა:"
                value={data.description.ka}
                onChange={(value) => setData('description.ka', value)}
                error={errors['description.ka']}
                validate={validateGeorgianText}
                badge="ქარ"
            />
        </>
    );
}
