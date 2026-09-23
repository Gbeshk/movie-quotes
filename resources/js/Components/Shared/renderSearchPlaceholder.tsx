export function renderSearchPlaceholder(text: string) {
    return text.split(/(@|#)/).map((part, index) =>
        part === '@' || part === '#' ? (
            <span
                key={index}
                className="group-hover:text-modal-secondary-text mx-1 text-white transition-colors duration-150"
            >
                {part}
            </span>
        ) : (
            part
        ),
    );
}
