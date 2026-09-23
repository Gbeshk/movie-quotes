# Movie Quotes

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Resources](#resources)

## Introduction

Movie Quotes is a social platform for movie lovers. Users add movies and post their favorite quotes from them (with an optional photo), then like and comment on quotes from other users in a shared news feed. The app is bilingual — every piece of user-generated content (movie titles, directors, descriptions, quotes) can be entered and displayed in both Georgian and English — and supports signing in with a password or with Google.

It's a Laravel + Inertia + React + TypeScript monolith: there's no separate front-end app or REST API, the server renders Inertia pages that hydrate into a React SPA.

## Prerequisites

- PHP 8.3+
- Composer 2+
- Node.js 22+ and npm
- MySQL 8+ (used for local development; the test suite runs against an in-memory SQLite database instead, so MySQL isn't required just to run tests)

## Tech Stack

**Backend**

- [Laravel 13](https://laravel.com) — application framework
- [Inertia.js](https://inertiajs.com) (Laravel adapter) — connects Laravel routes/controllers directly to React pages, no separate API layer
- [Laravel Sanctum](https://laravel.com/docs/sanctum) — secures the Inertia session (stateful SPA auth), not a token API
- [Laravel Socialite](https://laravel.com/docs/socialite) — Google sign-in
- [Spatie Media Library](https://spatie.be/docs/laravel-medialibrary) — movie posters, quote images, and user avatars
- [Spatie Translatable](https://spatie.be/docs/laravel-translatable) — bilingual (ka/en) model fields
- [Pusher](https://pusher.com) via Laravel Echo — real-time notifications
- [Pest](https://pestphp.com) — testing

**Frontend**

- [React 18](https://react.dev) + TypeScript
- [Inertia.js](https://inertiajs.com) React adapter
- [Tailwind CSS v4](https://tailwindcss.com)
- [react-i18next](https://react.i18next.com) — client-side translations
- [Laravel Wayfinder](https://github.com/laravel/wayfinder) — generates typed TypeScript helpers for Laravel routes/controllers

**Tooling**

- [PHP-CS-Fixer](https://cs.symfony.com) — PHP code style (this project uses PHP-CS-Fixer, not Pint, even though `laravel/pint` is listed as a dependency — see [Development](#development))
- [ESLint](https://eslint.org) + [Prettier](https://prettier.io) — TypeScript/React linting and formatting
- [Vite](https://vite.dev) — frontend build tool

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/RedberryInternship/giorgi-beshkenadze-movie-quotes.git
    cd giorgi-beshkenadze-movie-quotes
    ```

2. Install PHP dependencies:

    ```bash
    composer install
    ```

3. Install JS dependencies:

    ```bash
    npm install
    ```

4. Copy the `.env` file and generate an app key:

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. Create a MySQL database and point `.env` at it:

    ```env
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=movie_quotes
    DB_USERNAME=root
    DB_PASSWORD=
    ```

    Then run the migrations:

    ```bash
    php artisan migrate
    ```

6. Link the public storage disk, so uploaded images (posters, quote images, avatars) are actually reachable in the browser:

    ```bash
    php artisan storage:link
    ```

7. (Optional) Fill in `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` and `PUSHER_APP_*` in `.env` if you want to test Google sign-in or real-time notifications locally. The app runs fine without them — those two features just won't work.

8. Build the frontend assets:

    ```bash
    npm run build
    ```

    This also regenerates Wayfinder's typed route helpers (`resources/js/actions/`, `resources/js/routes/`) — those folders are gitignored and rebuilt on every build, so never hand-edit them.

9. Serve the app:

    ```bash
    php artisan serve
    ```

Visit [http://localhost:8000](http://localhost:8000) — you should see the Movie Quotes landing page.

## Development

Instead of running the PHP server and Vite separately, use Laravel's built-in `dev` command, which runs the server, queue listener, log watcher, and Vite dev server together:

```bash
composer dev
```

Vite's dev server hot-reloads React/TypeScript changes automatically while it's running, so there's no manual rebuild step during day-to-day development.

Before opening a pull request, run the same checks CI runs:

```bash
vendor/bin/php-cs-fixer fix --using-cache=no   # format PHP
npm run lint                                   # lint & auto-fix TypeScript/React
npm run format                                 # format with Prettier
composer test                                  # run the Pest test suite
```

`composer test` always runs against an in-memory SQLite database (configured in `phpunit.xml`), regardless of what `DB_CONNECTION` is set to in your local `.env`.

## Deployment

This project doesn't have a live deployment — it's a bootcamp assignment, and all work happens through pull requests merged into `main`. [GitHub Actions](.github/workflows/ci.yml) runs PHP-CS-Fixer, ESLint, Prettier, a full frontend build, and the Pest test suite on every push and pull request to `main`; a PR can't be merged until all of those checks pass.

## Resources

- **Design (Figma):** [Movie Quotes Bootcamp assignment](https://www.figma.com/design/5uMXCg3itJwpzh9cVIK3hA/Movie-Quotes-Bootcamp-assignment?node-id=335-24108&t=TPsplPZ1Vp1Ja2SS-0)
- **Database diagram (DrawSQL):** [Movie Quotes](https://drawsql.app/teams/giorgi-6/diagrams/movie-quotes)
