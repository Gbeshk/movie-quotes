import DefaultField from '@/Components/Shared/DefaultField';
import ImageUpload from '@/Components/Shared/ImageUpload';
import InlineLabelField from '@/Components/Shared/InlineLabelField';
import PlaceholderStyleField from '@/Components/Shared/PlaceholderStyleField';
import TagInput from '@/Components/Shared/TagInput';

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
};

type TagsFieldProps = {
    variant: 'tags';
    tags: string[];
    onChange: (tags: string[]) => void;
    error?: string;
    validate?: (value: string) => true | string;
    placeholder?: string;
};

type ImageFieldProps = {
    variant: 'image';
    file: File | null;
    onChange: (file: File | null) => void;
    error?: string;
    existingImageUrl?: string | null;
    heading?: string;
};

type FormFieldProps =
    | DefaultFieldProps
    | PlaceholderFieldProps
    | InlineLabelFieldProps
    | TagsFieldProps
    | ImageFieldProps;

export default function FormField(props: FormFieldProps) {
    if (props.variant === 'placeholder') {
        return <PlaceholderStyleField {...props} />;
    }

    if (props.variant === 'inline-label') {
        return <InlineLabelField {...props} />;
    }

    if (props.variant === 'tags') {
        return <TagInput {...props} />;
    }

    if (props.variant === 'image') {
        return <ImageUpload {...props} />;
    }

    return <DefaultField {...props} />;
}
