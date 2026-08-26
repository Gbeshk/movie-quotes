export interface User {
    id: number;
    username: string;
    email: string;
    email_verified_at?: string;
}

export interface Translatable {
    ka: string;
    en: string;
}

export interface Quote {
    id: number;
    movie_id: number;
    user_id: number;
    text: Translatable;
    user?: User;
}

export interface Movie {
    id: number;
    user_id: number;
    title: Translatable;
    director: Translatable;
    genre: string;
    release_year: number;
    description: Translatable;
    quotes_count?: number;
    quotes?: Quote[];
    user?: User;
}

export interface WelcomeQuote {
    id: number | string;
    text: Translatable;
    movie: {
        title: Translatable;
        release_year: number;
        poster_url: string;
    };
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
