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
