const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9]{3,15}$/;
const PASSWORD_PATTERN = /^[a-z0-9]{8,15}$/;

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
