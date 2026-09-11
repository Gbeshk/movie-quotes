export default function GenreTags({ genres }: { genres: string[] }) {
    return (
        <div className="flex items-center gap-2">
            {genres.map((genre) => (
                <div
                    key={genre}
                    className="bg-modal-secondary-text rounded px-3 py-1.5 text-center align-middle text-lg leading-none font-bold text-white"
                >
                    {genre}
                </div>
            ))}
        </div>
    );
}
