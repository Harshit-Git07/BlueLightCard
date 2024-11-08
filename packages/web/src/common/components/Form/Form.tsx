import { FC, useMemo, useState } from 'react';
import { Control, Controller, ErrorOption, FieldErrors, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectShape } from 'yup';
import flatten from 'lodash/flatten';
import { FormProps, FormField, FormSubmitSchema } from './types';
import Button from '../Button/Button';
import FieldGroup from '../FieldGroup/FieldGroup';
import { FieldGroupMessage } from '../FieldGroup/types';

const FormFieldController: FC<{
  control: Control;
  errors: FieldErrors<FormSubmitSchema>;
  formField: FormField;
}> = ({ control, errors, formField }) => {
  const error = errors[formField.controlId] as ErrorOption;
  const [passwordVisible, setPasswordVisible] = useState(false);

  let message: string | FieldGroupMessage[] | undefined = formField.message;

  if (formField.passwordCriteria && error) {
    message = formField.passwordCriteria.reduce<FieldGroupMessage[]>((acc, criteria) => {
      const errorMessage = error?.types?.[criteria.validationType] as string | string[];
      const validationMessage = criteria.message;
      acc.push({
        invalid: !!(Array.isArray(errorMessage)
          ? errorMessage.find((msg) => msg === validationMessage)
          : errorMessage === validationMessage),
        message: validationMessage,
      });
      return acc;
    }, []);
  } else if (error?.message) {
    message = error.message;
  }

  return (
    <Controller
      key={formField.controlId}
      name={formField.controlId}
      control={control}
      rules={{ required: formField.required }}
      render={({ field }) => (
        <FieldGroup
          labelText={formField.label}
          controlId={formField.controlId}
          invalid={!!errors[formField.controlId]?.message}
          password={formField.password}
          passwordVisible={passwordVisible}
          message={message}
          onTogglePasswordVisible={
            formField.password ? (visible) => setPasswordVisible(visible) : undefined
          }
        >
          <formField.fieldComponent
            error={!!errors[formField.controlId]?.message}
            success={!!field.value && !errors[formField.controlId]}
            required={formField.required}
            {...formField.fieldComponentProps}
            {...field}
            type={passwordVisible ? 'text' : formField?.fieldComponentProps?.type}
          />
        </FieldGroup>
      )}
    />
  );
};

/**
 * Form component used for building data driven forms
 * @param props - Provide JSON schema for the form fields
 * @returns React component
 */
const Form: FC<FormProps> = ({ submitButtonText, onSubmit, fields }) => {
  const fieldsFlattened = useMemo(() => flatten(fields), [fields]);

  const validationSchema = yup.object().shape(
    fieldsFlattened.reduce<ObjectShape>((acc, field) => {
      if (field.validation) {
        acc[field.controlId] = field.validation;
      }
      return acc;
    }, {})
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSubmitSchema>({
    defaultValues: fieldsFlattened.reduce<{ [controlId: string]: unknown | undefined }>(
      (acc, field) => {
        acc[field.controlId] = field.fieldComponentProps?.value;
        return acc;
      },
      {}
    ) as {},
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(validationSchema, {
      abortEarly: false,
      strict: false,
    }),
  });

  const formHasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((formField, index) =>
        Array.isArray(formField) ? (
          <div className="flex gap-4" key={`formRow_${index}`}>
            {formField.map((_formField) => (
              <div className="w-full" key={_formField.controlId}>
                <FormFieldController control={control} errors={errors} formField={_formField} />
              </div>
            ))}
          </div>
        ) : (
          <FormFieldController
            key={formField.controlId}
            control={control}
            errors={errors}
            formField={formField}
          />
        )
      )}
      <Button type="submit" disabled={formHasErrors}>
        {submitButtonText ?? 'Submit'}
      </Button>
    </form>
  );
};

export default Form;
