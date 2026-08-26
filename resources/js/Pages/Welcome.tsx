import ArrowDown from '@/Components/Shared/Icons/ArrowDown';
import QuoteSequence from '@/Components/Welcome/QuoteSequence';
import { WelcomeQuote } from '@/types';
import { Head } from '@inertiajs/react';

export default function Welcome({ quotes }: { quotes: WelcomeQuote[] }) {
    return (
        <>
            <Head title="Landing" />
            <div>
                <div className="w-full bg-black px-17.5 py-8">
                    <div className="flex items-center justify-between">
                        <p className="text-logo-text cursor-pointer text-base leading-normal font-medium tracking-normal uppercase">
                            Movie quotes
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex cursor-pointer items-center justify-center gap-2 pr-5.5">
                                <p className="text-base leading-normal font-normal tracking-normal text-white">
                                    Eng
                                </p>
                                <ArrowDown />
                            </div>
                            <button className="bg-sign-up-btn-bg flex cursor-pointer items-center justify-center rounded px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white">
                                Sign Up
                            </button>
                            <button className="flex cursor-pointer items-center justify-center rounded border border-white px-6.5 py-1.75 text-base leading-normal font-normal tracking-normal text-white">
                                Log in
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex h-180 w-full flex-col items-center justify-center gap-6 bg-black">
                    <p className="text-logo-text font-montserrat text-center text-6xl leading-normal font-bold tracking-normal">
                        Find any quote in <br /> millions of movie lines
                    </p>
                    <button className="bg-sign-up-btn-bg flex cursor-pointer items-center justify-center rounded px-4.25 py-2.25 text-base leading-normal font-normal tracking-normal text-white">
                        Get started
                    </button>
                </div>
                <QuoteSequence quotes={quotes} />
                <div className="bg-gradient-dark text-logo-text flex h-12 items-center px-17.5 text-xs leading-normal font-medium tracking-normal uppercase">
                    © 2022 movie quotes. All rights reserved.
                </div>
            </div>
        </>
    );
}
