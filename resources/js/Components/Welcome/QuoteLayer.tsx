import { useTranslatable } from '@/lib/translatable';
import { WelcomeQuote } from '@/types';

export default function QuoteLayer({
    quote,
    progress = 0,
    direction = 'exit',
}: {
    quote: WelcomeQuote;
    progress?: number;
    direction?: 'exit' | 'enter';
}) {
    const translate = useTranslatable();
    const exitProgress = Math.min(progress * 2, 1);
    const enterProgress = Math.max((progress - 0.4) / 0.6, 0);
    const translateY = direction === 'exit' ? -exitProgress * 100 : (1 - enterProgress) * 60;

    return (
        <>
            <img
                src={quote.image_url}
                alt={translate(quote.movie.title)}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div
                className="absolute top-103.25 left-42.5 flex max-xl:left-20 max-sm:top-55 max-sm:left-9"
                style={{ transform: `translateY(${translateY}vh)` }}
            >
                <div className="mt-9 mr-3 h-0.5 w-13.25 bg-white max-sm:mt-4 max-sm:w-4" />
                <div className="flex flex-col gap-4">
                    <p className="font-montserrat line-clamp-3 max-w-[min(50rem,calc(100vw-16rem))] text-5xl leading-normal font-bold tracking-normal wrap-break-word text-white max-xl:max-w-[calc(100vw-10rem)] max-sm:max-w-[calc(100vw-5rem)] max-sm:text-xl">
                        “{translate(quote.text)}”
                    </p>
                    <p className="font-helvetica text-landing-movie-name line-clamp-3 max-w-[min(50rem,calc(100vw-16rem))] text-3xl leading-normal font-bold tracking-normal wrap-break-word max-xl:max-w-[calc(100vw-10rem)] max-sm:max-w-[calc(100vw-5rem)] max-sm:text-base">
                        {translate(quote.movie.title)}, {quote.movie.release_year}
                    </p>
                </div>
            </div>
        </>
    );
}
