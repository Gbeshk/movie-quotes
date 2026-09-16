import UserAvatar from '@/Components/Shared/UserAvatar';
import { AuthenticatedPageProps, Comment } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';

export default function PostCommentForm({
    quoteId,
    redirectTo,
    onCommentAdded,
}: {
    quoteId: number;
    redirectTo?: 'feed';
    onCommentAdded: (comment: Comment) => void;
}) {
    const { t } = useTranslation();
    const { auth } = usePage<AuthenticatedPageProps>().props;
    const { data, setData, post, processing, reset } = useForm({
        body: '',
        redirect_to: redirectTo,
    });

    const submit = () => {
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

    const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="mt-6 flex h-13 items-center gap-6">
            <UserAvatar user={auth.user} />
            <input
                value={data.body}
                onChange={(e) => setData('body', e.target.value)}
                onKeyDown={submitOnEnter}
                disabled={processing}
                placeholder={t('post.writeComment')}
                className="bg-header-bg/60 text-input-bg placeholder:text-input-bg h-full flex-1 rounded-xl border-0 px-4 text-xl leading-normal font-normal tracking-normal outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {data.body.trim() !== '' && (
                <button
                    type="button"
                    onClick={submit}
                    disabled={processing}
                    className="bg-danger flex h-full shrink-0 cursor-pointer items-center justify-center rounded-xl px-6 text-xl leading-normal font-normal tracking-normal text-white"
                >
                    {t('post.post')}
                </button>
            )}
        </div>
    );
}
