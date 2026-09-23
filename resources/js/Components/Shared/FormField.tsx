import DefaultField from '@/Components/Shared/DefaultField';
import InlineLabelField from '@/Components/Shared/InlineLabelField';
import PlaceholderStyleField from '@/Components/Shared/PlaceholderStyleField';

type DefaultFieldProps = {
    variant?: 'default';
    label: string;
    id: string;
    type?: 'text' | 'email' | 'password';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    autoComplete?: string;
    required?: boolean;
    heightClassName?: string;
    labelGapClassName?: string;
};

type PlaceholderFieldProps = {
    variant: 'placeholder';
    as?: 'input' | 'textarea';
    id: string;
    name: string;
    inputMode?: 'numeric';
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    badge?: string;
    className?: string;
    textareaHeightClassName?: string;
    maxLength?: number;
    readOnly?: boolean;
};

type InlineLabelFieldProps = {
    variant: 'inline-label';
    as?: 'input' | 'textarea';
    id: string;
    name: string;
    label: string;
    inputMode?: 'numeric';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    validate?: (value: string) => true | string;
    badge?: string;
    className?: string;
    maxLength?: number;
};

type FormFieldProps = DefaultFieldProps | PlaceholderFieldProps | InlineLabelFieldProps;

export default function FormField(props: FormFieldProps) {
    if (props.variant === 'placeholder') {
        return <PlaceholderStyleField {...props} />;
    }

    if (props.variant === 'inline-label') {
        return <InlineLabelField {...props} />;
    }

    return <DefaultField {...props} />;
}
