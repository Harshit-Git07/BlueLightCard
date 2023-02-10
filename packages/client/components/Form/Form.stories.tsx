import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as yup from 'yup';
import Form from '@/components/Form/Form';
import InputTextField from '../InputTextField/InputTextField';
import { InputTextFieldProps } from '../InputTextField/types';
import withForwardRef from '../_shared/hoc/withForwardRef';
import InputDOBField from '../InputDOBField/InputDOBField';
import { InputDOBFieldProps } from '../InputDOBField/types';

const componentMeta: ComponentMeta<typeof Form> = {
  title: 'Component System/Form/Form',
  component: Form,
  argTypes: {
    fields: {
      table: {
        disable: true,
      },
    },
  },
};

const FormTemplate: ComponentStory<typeof Form> = (args) => <Form {...args} />;

const InputTextFieldWithRef = withForwardRef(InputTextField);
const InputDOBFieldWithRef = withForwardRef(InputDOBField);

export const FormStory = FormTemplate.bind({});

FormStory.args = {
  fields: [
    [
      {
        label: 'First name',
        controlId: 'firstNameFieldControl',
        required: true,
        fieldComponent: InputTextFieldWithRef,
      },
      {
        label: 'Last name',
        controlId: 'lastNameFieldControl',
        required: true,
        fieldComponent: InputTextFieldWithRef,
      },
    ],
    {
      label: 'Email Address',
      controlId: 'emailFieldControl',
      required: true,
      validation: yup
        .string()
        .email('Email address is a required field')
        .required('Email address is required'),
      fieldComponent: InputTextFieldWithRef,
      fieldComponentProps: {
        type: 'email',
      } as InputTextFieldProps,
    },
  ],
};

export default componentMeta;
