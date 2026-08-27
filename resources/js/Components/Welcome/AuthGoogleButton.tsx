import GoogleIcon from '@/Components/Shared/Icons/GoogleIcon';

export default function AuthGoogleButton({ label }: { label: string }) {
    return (
        <button
            type="button"
            className="border-input-bg mt-4 flex h-9.5 w-full cursor-pointer items-center justify-center gap-2 rounded border text-base text-white"
        >
            <GoogleIcon />
            {label}
        </button>
    );
}
