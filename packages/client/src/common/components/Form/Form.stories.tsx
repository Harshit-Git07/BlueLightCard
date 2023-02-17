import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as yup from 'yup';
import Form from '@/components/Form/Form';
import InputTextField from '@/components/InputTextField/InputTextField';
import { InputTextFieldProps } from '@/components/InputTextField/types';

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
    [
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
    ],
    {
      label: 'Email',
      controlId: 'emailFieldControl',
      required: true,
      message: 'Provide a valid email address',
      validation: yup
        .string()
        .email('Email address is a required field')
        .required('Email address is required'),
      fieldComponent: InputTextField,
      fieldComponentProps: {
        type: 'email',
      } as InputTextFieldProps,
    },
  ],
};

export default componentMeta;
