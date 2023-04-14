import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as yup from 'yup';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import Form from '@/components/Form/Form';
import InputTextField from '@/components/InputTextField/InputTextField';
import InputDOBField from '@/components/InputDOBField/InputDOBField';
import { InputTextFieldProps } from '@/components/InputTextField/types';

dayjs.extend(customParseFormat);

const componentMeta: ComponentMeta<typeof Form> = {
  title: 'Component System/Form/Form',
  component: Form,
  argTypes: {
    fields: {
      table: {
        disable: true,
      },
    },
    onSubmit: {
      table: {
        disable: true,
      },
    },
  },
};

const FormTemplate: ComponentStory<typeof Form> = (args) => <Form {...args} />;

export const FormStory = FormTemplate.bind({});

FormStory.args = {
  fields: [
    {
      label: 'First name',
      controlId: 'firstNameFieldControl',
      required: true,
      message: 'Provide your first name',
      fieldComponent: InputTextField,
    },
    {
      label: 'Last name',
      controlId: 'lastNameFieldControl',
      required: true,
      message: 'Provide your last name',
      fieldComponent: InputTextField,
    },
    {
      label: 'Date of Birth',
      controlId: 'dobFieldControl',
      required: true,
      message: 'Provide your date of birth',
      fieldComponent: InputDOBField,
      validation: yup
        .date()
        .typeError('Date of birth must be in DD/MM/YYYY format')
        .transform((value, originalValue) => {
          if (dayjs(originalValue, 'DD/MM/YYYY').isValid()) {
            return dayjs(originalValue, 'DD/MM/YYYY').toDate();
          }
          return originalValue;
        })
        .max(new Date())
        .required('Date of birth is required'),
    },
    {
      label: 'Email',
      controlId: 'emailFieldControl',
      required: true,
      message: 'Provide a valid email address',
      validation: yup
        .string()
        .email('Please provide a valid email address')
        .required('Email address is required'),
      fieldComponent: InputTextField,
      fieldComponentProps: {
        type: 'email',
      } as InputTextFieldProps,
    },
  ],
};

export default componentMeta;
