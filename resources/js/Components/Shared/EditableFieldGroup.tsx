import FormFieldRow from '@/Components/Shared/FormFieldRow';
import ReadOnlyFieldRow from '@/Components/Shared/ReadOnlyFieldRow';

export default function EditableFieldGroup({
    readOnlyLabel,
    readOnlyValue,
    editing,
    onToggle,
    hideToggle = false,
    newFieldLabel,
    id,
    type = 'text',
    value,
    onChange,
    error,
    validate,
    autoComplete,
}: {
    readOnlyLabel: string;
    readOnlyValue: string;
    editing: boolean;
    onToggle: () => void;
    hideToggle?: boolean;
    newFieldLabel: string;
    id: string;
    type?: 'text' | 'email' | 'password';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    autoComplete?: string;
}) {
    return (
        <div className="flex flex-col">
            <ReadOnlyFieldRow
                label={readOnlyLabel}
                value={readOnlyValue}
                editing={editing}
                onToggle={onToggle}
                hideToggle={hideToggle}
            />

            {editing && (
                <div className="mt-14">
                    <FormFieldRow
                        label={newFieldLabel}
                        id={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        error={error}
                        validate={validate}
                        autoComplete={autoComplete}
                    />
                </div>
            )}
        </div>
    );
}
