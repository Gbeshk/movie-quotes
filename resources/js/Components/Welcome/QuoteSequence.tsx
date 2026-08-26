import { useScrollSequence } from '@/hooks/useScrollSequence';
import { WelcomeQuote } from '@/types';
import QuoteLayer from './QuoteLayer';

export default function QuoteSequence({ quotes }: { quotes: WelcomeQuote[] }) {
    const { ref, progress } = useScrollSequence(quotes.length);

    if (quotes.length === 0) {
        return null;
    }

    const activeIndex = Math.min(Math.floor(progress), Math.max(quotes.length - 2, 0));
    const segmentProgress = quotes.length > 1 ? progress - activeIndex : 0;
    const current = quotes[activeIndex];
    const next = quotes[activeIndex + 1];
    const clipBottom = segmentProgress * 100;

    return (
        <div ref={ref} className="relative w-full" style={{ height: `${quotes.length * 100}vh` }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                {next && (
                    <div className="absolute inset-0 z-0 h-full w-full">
                        <QuoteLayer quote={next} progress={segmentProgress} direction="enter" />
                    </div>
                )}

                <div
                    className="absolute inset-0 z-10 h-full w-full"
                    style={{ clipPath: `inset(0 0 ${clipBottom}% 0)` }}
                >
                    <QuoteLayer quote={current} progress={segmentProgress} direction="exit" />
                </div>
            </div>
        </div>
    );
}
