import { useState } from 'react';

export function useFieldStatus(
    value: string,
    error: string | undefined,
    validate?: (value: string) => true | string,
) {
    const [touched, setTouched] = useState(false);
    const [previousError, setPreviousError] = useState(error);
    const [erroredValue, setErroredValue] = useState('');

    if (error !== previousError) {
        setPreviousError(error);

        if (error) {
            setErroredValue(value);
        }
    }

    const validationResult = validate
        ? validate(value)
        : value.trim().length > 0 || 'This field is required.';
    const isValid = validationResult === true;
    const clientErrorMessage = isValid ? undefined : validationResult;
    const hasUnresolvedServerError = Boolean(error) && value === erroredValue;
    const isTouched = touched || Boolean(error);

    const status: 'default' | 'success' | 'error' = hasUnresolvedServerError
        ? 'error'
        : !isTouched
          ? 'default'
          : isValid
            ? 'success'
            : 'error';

    return {
        status,
        errorMessage: hasUnresolvedServerError ? error : clientErrorMessage,
        markTouched: () => setTouched(true),
    };
}
