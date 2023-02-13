import { FC, useMemo } from 'react';
import BootstrapForm from 'react-bootstrap/Form';
import { Control, Controller, FieldErrors, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectShape } from 'yup/lib/object';
import flatten from 'lodash/flatten';
import FieldGroup from '../FieldGroup/FieldGroup';
import { FormData, FormField } from './types';
import Button from '../Button/Button';
import { Col, Row } from 'react-bootstrap';

const FormFieldController: FC<{
  control: Control;
  errors: FieldErrors<{ [key: string]: unknown }>;
  formField: FormField;
}> = ({ control, errors, formField }) => {
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
          message={errors[formField.controlId]?.message ?? formField.message}
        >
          <formField.fieldComponent
            error={!!errors[formField.controlId]?.message}
            required={formField.required}
            {...formField.fieldComponentProps}
            {...field}
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
const Form: FC<FormData> = ({ submitButtonText, fields }) => {
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
  } = useForm<{ [key: string]: unknown }>({
    defaultValues: fieldsFlattened.reduce<{ [controlId: string]: unknown | undefined }>(
      (acc, field) => {
        acc[field.controlId] = field.fieldComponentProps?.value;
        return acc;
      },
      {}
    ) as {},
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  const onFormSubmit = (data: any) => {
    console.info(data);
  };

  return (
    <BootstrapForm onSubmit={handleSubmit(onFormSubmit)}>
      {fields.map((formField, index) =>
        Array.isArray(formField) ? (
          <Row key={`formRow_${index}`}>
            {formField.map((_formField) => (
              <Col key={_formField.controlId}>
                <FormFieldController control={control} errors={errors} formField={_formField} />
              </Col>
            ))}
          </Row>
        ) : (
          <FormFieldController
            key={formField.controlId}
            control={control}
            errors={errors}
            formField={formField}
          />
        )
      )}
      <Button text={submitButtonText ?? 'Submit'} type="submit" />
    </BootstrapForm>
  );
};

export default Form;
