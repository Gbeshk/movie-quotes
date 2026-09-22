import UserAvatar from '@/Components/Shared/UserAvatar';
import { useClampOverflow } from '@/hooks/useClampOverflow';
import { cn } from '@/lib/cn';
import { Comment } from '@/types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PostComment({ comment }: { comment: Comment }) {
    const { t } = useTranslation();
    const { ref: bodyRef, isClamped } = useClampOverflow<HTMLParagraphElement>();
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mt-6">
            <div className="flex items-center gap-4">
                <UserAvatar user={comment.user} className="max-sm:h-10 max-sm:w-10" />
                <p className="text-xl leading-normal font-normal text-white max-sm:text-base">
                    {comment.user.username}
                </p>
            </div>
            <p
                ref={bodyRef}
                className={cn(
                    'ml-17 text-xl leading-normal font-normal tracking-normal wrap-break-word text-white max-sm:mt-3 max-sm:ml-0 max-sm:text-base',
                    !expanded && 'line-clamp-3',
                )}
            >
                {comment.body}
            </p>
            {(isClamped || expanded) && (
                <button
                    type="button"
                    onClick={() => setExpanded((current) => !current)}
                    className="text-modal-secondary-text ml-17 cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline max-sm:ml-0 max-sm:text-sm"
                >
                    {expanded ? t('post.seeLessComment') : t('post.seeFullComment')}
                </button>
            )}
            <div className="bg-line mt-4 h-px w-full"></div>
        </div>
    );
}
