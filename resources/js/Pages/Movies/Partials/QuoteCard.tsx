import CommentIcon from '@/Components/Shared/Icons/CommentIcon';
import EditIcon from '@/Components/Shared/Icons/EditIcon';
import HeartIcon from '@/Components/Shared/Icons/HeartIcon';
import TrashIcon from '@/Components/Shared/Icons/TrashIcon';
import ViewIcon from '@/Components/Shared/Icons/ViewIcon';
import OptionsMenu from '@/Components/Shared/OptionsMenu';
import { Quote } from '@/types';

export default function QuoteCard({
    quote,
    isAuthor = false,
    onEdit,
    onDelete,
    onView,
}: {
    quote: Quote;
    isAuthor?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onView?: () => void;
}) {
    return (
        <div className="border-modal-secondary-text bg-profile-modal-bg relative h-67 w-full rounded-xl px-8 py-6 backdrop-blur-[50px]">
            <div className="absolute top-6 right-8">
                <OptionsMenu
                    actions={[
                        { label: 'View Quote', icon: <ViewIcon />, onClick: onView ?? (() => {}) },
                        ...(isAuthor
                            ? [
                                  {
                                      label: 'Edit',
                                      icon: <EditIcon />,
                                      onClick: onEdit ?? (() => {}),
                                  },
                                  {
                                      label: 'Delete',
                                      icon: <TrashIcon />,
                                      onClick: onDelete ?? (() => {}),
                                      variant: 'danger' as const,
                                  },
                              ]
                            : []),
                    ]}
                />
            </div>
            <div className="flex items-center gap-8">
                <div className="bg-input-bg h-35 w-56.5 shrink-0 overflow-hidden rounded-lg">
                    {quote.image_url && (
                        <img src={quote.image_url} alt="" className="h-full w-full object-cover" />
                    )}
                </div>
                <p className="text-input-bg text-2xl leading-relaxed font-normal tracking-normal">
                    "<span className="italic">{quote.text.en}</span>"
                </p>
            </div>
            <div className="bg-add-movie-line mt-6 h-px w-full"></div>
            <div className="mt-6 flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <p className="text-xl leading-relaxed font-normal tracking-normal text-white">
                        {quote.comments_count ?? 0}
                    </p>
                    <CommentIcon />
                </div>
                <div className="flex items-center gap-3">
                    <p className="text-xl leading-relaxed font-normal tracking-normal text-white">
                        {quote.likes_count ?? 0}
                    </p>
                    <HeartIcon />
                </div>
            </div>
        </div>
    );
}
