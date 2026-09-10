import FormField from '@/Components/Shared/FormField';
import { validateEnglishText, validateGeorgianText } from '@/lib/validators';
import { InertiaFormProps } from '@inertiajs/react';
import { QuoteFormData } from '@/types';

export default function QuoteFormFields({
    data,
    setData,
    errors,
}: Pick<InertiaFormProps<QuoteFormData>, 'data' | 'setData' | 'errors'>) {
    return (
        <>
            <FormField
                variant="placeholder"
                as="textarea"
                className="mt-7"
                textareaHeightClassName="h-21.5"
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
                textareaHeightClassName="h-21.5"
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
