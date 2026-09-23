import SaveCancelActions from '@/Components/Shared/SaveCancelActions';
import MobileFieldEditView from '@/Pages/Profile/Partials/MobileFieldEditView';
import { FormEventHandler, ReactNode } from 'react';

export default function MobileFieldEditForm({
    formId,
    onSubmit,
    onBack,
    formClassName = 'mt-8',
    changed,
    onCancel,
    processing,
    onRequestSave,
    children,
}: {
    formId: string;
    onSubmit: FormEventHandler;
    onBack: () => void;
    formClassName?: string;
    changed: boolean;
    onCancel: () => void;
    processing: boolean;
    onRequestSave: () => void;
    children: ReactNode;
}) {
    return (
        <>
            <MobileFieldEditView onBack={onBack}>
                <form id={formId} onSubmit={onSubmit} className={formClassName}>
                    {children}
                </form>
            </MobileFieldEditView>
            {changed && (
                <div className="-mx-8 mt-8 flex items-center justify-between px-7 md:hidden">
                    <SaveCancelActions
                        formId={formId}
                        onCancel={onCancel}
                        processing={processing}
                        onRequestSave={onRequestSave}
                        spread
                    />
                </div>
            )}
        </>
    );
}
