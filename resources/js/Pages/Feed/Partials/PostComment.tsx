import UserAvatar from '@/Components/Shared/UserAvatar';
import { Comment } from '@/types';

export default function PostComment({ comment }: { comment: Comment }) {
    return (
        <div className="mt-6">
            <div className="flex items-center gap-4">
                <UserAvatar user={comment.user} />
                <p className="text-xl leading-normal font-normal text-white">
                    {comment.user.username}
                </p>
            </div>
            <p className="ml-17 text-xl leading-normal font-normal tracking-normal text-white">
                {comment.body}
            </p>
            <div className="bg-line mt-4 h-px w-full"></div>
        </div>
    );
}
