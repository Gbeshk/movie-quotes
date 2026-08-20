import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AddMovieModal({ show, onClose }: { show: boolean; onClose: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        title: { ka: string; en: string };
        director: { ka: string; en: string };
        genre: string;
        release_year: string;
        description: { ka: string; en: string };
        poster: File | null;
    }>({
        title: { ka: '', en: '' },
        director: { ka: '', en: '' },
        genre: '',
        release_year: '',
        description: { ka: '', en: '' },
        poster: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('movies.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">Add Movie</h2>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="title_en" value="Title (English)" />
                        <TextInput
                            id="title_en"
                            className="mt-1 block w-full"
                            value={data.title.en}
                            onChange={(e) =>
                                setData('title', { ...data.title, en: e.target.value })
                            }
                        />
                        <InputError message={errors['title.en']} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="title_ka" value="სათაური (ქართული)" />
                        <TextInput
                            id="title_ka"
                            className="mt-1 block w-full"
                            value={data.title.ka}
                            onChange={(e) =>
                                setData('title', { ...data.title, ka: e.target.value })
                            }
                        />
                        <InputError message={errors['title.ka']} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="director_en" value="Director (English)" />
                        <TextInput
                            id="director_en"
                            className="mt-1 block w-full"
                            value={data.director.en}
                            onChange={(e) =>
                                setData('director', { ...data.director, en: e.target.value })
                            }
                        />
                        <InputError message={errors['director.en']} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="director_ka" value="რეჟისორი (ქართული)" />
                        <TextInput
                            id="director_ka"
                            className="mt-1 block w-full"
                            value={data.director.ka}
                            onChange={(e) =>
                                setData('director', { ...data.director, ka: e.target.value })
                            }
                        />
                        <InputError message={errors['director.ka']} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="genre" value="Genre" />
                        <TextInput
                            id="genre"
                            className="mt-1 block w-full"
                            value={data.genre}
                            onChange={(e) => setData('genre', e.target.value)}
                        />
                        <InputError message={errors.genre} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="release_year" value="Release year" />
                        <TextInput
                            id="release_year"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.release_year}
                            onChange={(e) => setData('release_year', e.target.value)}
                        />
                        <InputError message={errors.release_year} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="description_en" value="Description (English)" />
                        <textarea
                            id="description_en"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={3}
                            value={data.description.en}
                            onChange={(e) =>
                                setData('description', { ...data.description, en: e.target.value })
                            }
                        />
                        <InputError message={errors['description.en']} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="description_ka" value="აღწერა (ქართული)" />
                        <textarea
                            id="description_ka"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={3}
                            value={data.description.ka}
                            onChange={(e) =>
                                setData('description', { ...data.description, ka: e.target.value })
                            }
                        />
                        <InputError message={errors['description.ka']} className="mt-2" />
                    </div>

                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="poster" value="Poster" />
                        <input
                            id="poster"
                            type="file"
                            accept="image/*"
                            className="mt-1 block w-full text-sm"
                            onChange={(e) => setData('poster', e.target.files?.[0] ?? null)}
                        />
                        <InputError message={errors.poster} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
                    <PrimaryButton disabled={processing}>Add Movie</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
