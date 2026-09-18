import FormField from '@/Components/Shared/FormField';
import { validateEnglishText, validateGeorgianText } from '@/utils/validators';
import { InertiaFormProps } from '@inertiajs/react';
import { QuoteFormData } from '@/types';

export default function QuoteFormFields({
    data,
    setData,
    errors,
    textareaHeightClassName = 'h-18',
}: Pick<InertiaFormProps<QuoteFormData>, 'data' | 'setData' | 'errors'> & {
    textareaHeightClassName?: string;
}) {
    return (
        <>
            <FormField
                variant="placeholder"
                as="textarea"
                className="mt-7"
                textareaHeightClassName={textareaHeightClassName}
                id="quote_text_en"
                name="text_en"
                placeholder="“Quote in English.”"
                value={data.text.en}
                onChange={(value) => setData('text.en', value)}
                error={errors['text.en']}
                validate={validateEnglishText}
                badge="Eng"
            />
            <FormField
                variant="placeholder"
                as="textarea"
                className="mt-6"
                textareaHeightClassName={textareaHeightClassName}
                id="quote_text_ka"
                name="text_ka"
                placeholder="“ციტატა ქართულ ენაზე”"
                value={data.text.ka}
                onChange={(value) => setData('text.ka', value)}
                error={errors['text.ka']}
                validate={validateGeorgianText}
                badge="ქარ"
            />
        </>
    );
}
