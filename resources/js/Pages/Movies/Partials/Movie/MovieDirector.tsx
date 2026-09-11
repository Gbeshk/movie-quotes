export default function MovieDirector({ director }: { director: string }) {
    return (
        <p className="text-input-bg text-lg font-bold">
            Director: <span className="text-white">{director}</span>
        </p>
    );
}
