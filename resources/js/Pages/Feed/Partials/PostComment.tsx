import ClampText from '@/Components/Shared/ClampText';
import UserAvatar from '@/Components/Shared/UserAvatar';
import { Comment } from '@/types';
import { useTranslation } from 'react-i18next';

export default function PostComment({ comment }: { comment: Comment }) {
    const { t } = useTranslation();

    return (
        <div className="mt-6">
            <div className="flex items-center gap-4">
                <UserAvatar user={comment.user} className="max-sm:h-10 max-sm:w-10" />
                <p className="text-xl leading-normal font-normal text-white max-sm:text-base">
                    {comment.user.username}
                </p>
            </div>
            <ClampText
                className="ml-17 text-xl leading-normal font-normal tracking-normal wrap-break-word text-white max-sm:mt-3 max-sm:ml-0 max-sm:text-base"
                moreLabel={t('post.seeFullComment')}
                lessLabel={t('post.seeLessComment')}
                buttonClassName="text-modal-secondary-text ml-17 cursor-pointer text-base leading-normal font-normal tracking-normal hover:underline max-sm:ml-0 max-sm:text-sm"
            >
                {comment.body}
            </ClampText>
            <div className="bg-line mt-4 h-px w-full"></div>
        </div>
    );
}
