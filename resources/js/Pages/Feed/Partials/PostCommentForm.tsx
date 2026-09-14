import UserAvatar from '@/Components/Shared/UserAvatar';
import { AuthenticatedPageProps, Comment } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function PostCommentForm({
    quoteId,
    onCommentAdded,
}: {
    quoteId: number;
    onCommentAdded: (comment: Comment) => void;
}) {
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const { data, setData, post, processing, reset } = useForm({
        body: '',
        redirect_to: 'feed' as const,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.body.trim()) {
            return;
        }

        post(route('quotes.comments.store', quoteId), {
            preserveScroll: true,
            preserveState: true,
            except: ['quotes', 'movieOptions'],
            onSuccess: () => {
                onCommentAdded({ id: Date.now(), body: data.body, user: auth.user });
                reset('body');
            },
        });
    };

    return (
        <form onSubmit={submit} className="mt-6 flex h-13 items-center gap-6">
            <UserAvatar user={auth.user} />
            <input
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                disabled={processing}
                placeholder="Write a comment"
                className="bg-header-bg/60 text-input-bg placeholder:text-input-bg h-full flex-1 rounded-xl border-0 px-4 text-xl leading-normal font-normal tracking-normal outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {data.body.trim() !== '' && (
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-danger flex h-full shrink-0 cursor-pointer items-center justify-center rounded-xl px-6 text-xl leading-normal font-normal tracking-normal text-white"
                >
                    Post
                </button>
            )}
        </form>
    );
}
