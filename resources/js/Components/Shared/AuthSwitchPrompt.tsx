export default function AuthSwitchPrompt({
    prompt,
    actionLabel,
    onAction,
}: {
    prompt: string;
    actionLabel: string;
    onAction: () => void;
}) {
    return (
        <p className="text-modal-secondary-text mt-8 text-base">
            {prompt}{' '}
            <span onClick={onAction} className="text-link-text cursor-pointer underline">
                {actionLabel}
            </span>
        </p>
    );
}
