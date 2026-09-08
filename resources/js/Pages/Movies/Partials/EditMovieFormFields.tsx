import FormField from '@/Components/Shared/FormField';
import TagInput from '@/Components/Shared/TagInput';
import {
    isEnglishText,
    validateEnglishText,
    validateGeorgianText,
    validateReleaseYear,
} from '@/lib/validators';
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
            <FormField
                variant="inline-label"
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
            <FormField
                variant="inline-label"
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
            <TagInput
                tags={data.genre}
                placeholder="Genre/ჟანრი"
                validate={(value) =>
                    isEnglishText(value) || 'Genre must contain only English characters.'
                }
                onChange={(genres) => {
                    setData('genre', genres);
                    clearErrors('genre');
                }}
                error={errors.genre}
            />
            <FormField
                variant="inline-label"
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
            <FormField
                variant="inline-label"
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
            <FormField
                variant="inline-label"
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
            <FormField
                variant="inline-label"
                as="textarea"
                id="edit_description_en"
                name="description_en"
                label="Movie description:"
                value={data.description.en}
                onChange={(value) => setData('description.en', value)}
                error={errors['description.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <FormField
                variant="inline-label"
                as="textarea"
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
