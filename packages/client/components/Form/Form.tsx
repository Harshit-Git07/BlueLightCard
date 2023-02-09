import { FC, useMemo } from 'react';
import BootstrapForm from 'react-bootstrap/Form';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ObjectShape } from 'yup/lib/object';
import FieldGroup from '../FieldGroup/FieldGroup';
import { FormData } from './types';
import Button from '../Button/Button';

const Form: FC<FormData> = ({ fields }) => {
  const validationSchema = useMemo(() => {
    const schema = fields.reduce<ObjectShape>((acc, field) => {
      if (field.validation) {
        acc[field.controlId] = field.validation;
      }
      return acc;
    }, {});
    return yup.object().shape(schema);
  }, [fields]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ [key: string]: unknown }>({
    defaultValues: fields.reduce<{ [controlId: string]: unknown | undefined }>((acc, field) => {
      acc[field.controlId] = field.fieldComponentProps?.value;
      return acc;
    }, {}) as {},
    mode: 'all',
    resolver: yupResolver(validationSchema),
  });

  const onFormSubmit = (data: any) => {
    console.info(data);
  };
  console.info(validationSchema);

  return (
    <BootstrapForm onSubmit={handleSubmit(onFormSubmit)}>
      {fields.map((formField) => {
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
                message={errors[formField.controlId]?.message}
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
      })}
      <Button text="Submit" type="submit" />
    </BootstrapForm>
  );
};

export default Form;
