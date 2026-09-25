const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9]{3,15}$/;
const PASSWORD_PATTERN = /^[a-z0-9]{8,15}$/;
const GEORGIAN_TEXT_PATTERN = /^[^a-zA-Z]*$/;
const ENGLISH_TEXT_PATTERN = /^[^Ⴀ-ჿ]*$/;

export function isValidEmail(value: string): boolean {
    return EMAIL_PATTERN.test(value);
}

export function isValidUsername(value: string): boolean {
    return USERNAME_PATTERN.test(value);
}

export function isValidPassword(value: string): boolean {
    return PASSWORD_PATTERN.test(value);
}

export function validateEmail(value: string): true | string {
    return isValidEmail(value) || 'Enter a valid email address.';
}

export function validateUsername(value: string): true | string {
    return isValidUsername(value) || 'Must be 3-15 lowercase letters or numbers.';
}

export function validatePassword(value: string): true | string {
    return isValidPassword(value) || 'Must be 8-15 lowercase letters or numbers.';
}

export function validatePasswordConfirmation(password: string) {
    return (value: string): true | string =>
        (value.length > 0 && value === password) || 'Passwords do not match.';
}

export function isGeorgianText(value: string): boolean {
    return GEORGIAN_TEXT_PATTERN.test(value);
}

export function isEnglishText(value: string): boolean {
    return ENGLISH_TEXT_PATTERN.test(value);
}

export function validateGeorgianText(value: string): true | string {
    if (value.trim().length === 0) {
        return 'This field is required.';
    }

    return isGeorgianText(value) || 'Must contain only Georgian characters.';
}

export function validateEnglishText(value: string): true | string {
    if (value.trim().length === 0) {
        return 'This field is required.';
    }

    return isEnglishText(value) || 'Must contain only English characters.';
}

export function validateReleaseYear(value: string): true | string {
    if (value.trim().length === 0) {
        return 'This field is required.';
    }

    const year = Number(value);
    const currentYear = new Date().getFullYear();

    if (!Number.isInteger(year)) {
        return 'Enter a valid year.';
    }

    return (year >= 1888 && year <= currentYear) || `Enter a year between 1888 and ${currentYear}.`;
}
