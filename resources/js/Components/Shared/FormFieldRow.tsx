import FieldSpacer from '@/Components/Shared/FieldSpacer';
import FormField from '@/Components/Shared/FormField';

export default function FormFieldRow({
    label,
    id,
    type = 'text',
    value,
    onChange,
    error,
    validate,
    autoComplete,
}: {
    label: string;
    id: string;
    type?: 'text' | 'email' | 'password';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    autoComplete?: string;
}) {
    return (
        <div className="flex items-center">
            <FormField
                label={label}
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                error={error}
                validate={validate}
                autoComplete={autoComplete}
                heightClassName="h-12"
            />
            <FieldSpacer />
        </div>
    );
}
