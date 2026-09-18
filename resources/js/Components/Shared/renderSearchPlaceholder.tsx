export function renderSearchPlaceholder(text: string) {
    return text.split(/(@|#)/).map((part, index) =>
        part === '@' || part === '#' ? (
            <span key={index} className="mx-1 text-white">
                {part}
            </span>
        ) : (
            part
        ),
    );
}
