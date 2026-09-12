export interface User {
    id: number;
    username: string;
    email: string;
    email_verified_at?: string;
    avatar_url: string | null;
    google_id: string | null;
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
    image_url: string | null;
    likes_count?: number;
    comments_count?: number;
    is_liked_by_me?: boolean;
    user?: User;
    movie?: Movie;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    body: string;
    user: User;
}

export type LiveNotification =
    | {
          kind: 'comment';
          quote_id: number;
          comment_id: number;
          commenter_id: number;
          commenter: string;
          body: string;
      }
    | { kind: 'like'; quote_id: number; liker_id: number; liker: string };

export interface StoredNotification {
    id: string;
    read_at: string | null;
    created_at: string;
    data: LiveNotification;
}

export interface Movie {
    id: number;
    user_id: number;
    title: Translatable;
    director: Translatable;
    genre: string[];
    release_year: number;
    description: Translatable;
    poster_url: string | null;
    quotes_count?: number;
    user?: User;
}

export interface MovieFormData {
    title: Translatable;
    director: Translatable;
    genre: string[];
    release_year: string;
    description: Translatable;
    poster: File | null;
}

export interface QuoteFormData {
    text: Translatable;
    image: File | null;
}

export interface Paginated<T> {
    data: T[];
}

export interface WelcomeQuote {
    id: number | string;
    text: Translatable;
    image_url: string;
    movie: {
        title: Translatable;
        release_year: number;
        poster_url: string;
    };
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    unreadNotificationsCount: number;
};

export type AuthenticatedPageProps<T extends Record<string, unknown> = Record<string, unknown>> =
    T & {
        auth: {
            user: User;
        };
        unreadNotificationsCount: number;
    };
