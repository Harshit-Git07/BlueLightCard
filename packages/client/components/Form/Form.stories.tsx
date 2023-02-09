import { ComponentMeta, ComponentStory } from '@storybook/react';
import * as yup from 'yup';
import Form from '@/components/Form/Form';
import InputTextField from '../InputTextField/InputTextField';
import { InputTextFieldProps } from '../InputTextField/types';
import withForwardRef from '../_shared/hoc/withForwardRef';

const componentMeta: ComponentMeta<typeof Form> = {
  title: 'Component System/Form/Form',
  component: Form,
  argTypes: {
    fields: {
      name: 'Fields',
      description: 'JSON form field definitions',
    },
  },
};

const FormTemplate: ComponentStory<typeof Form> = (args) => <Form {...args} />;

const InputTextFieldWithRef = withForwardRef(InputTextField);

export const FormStory = FormTemplate.bind({});

FormStory.args = {
  fields: [
    {
      label: 'Name',
      controlId: 'nameFieldControl',
      required: true,
      fieldComponent: InputTextFieldWithRef,
    },
    {
      label: 'Email Address',
      controlId: 'emailFieldControl',
      required: true,
      validation: yup.string().email().required('Email address is a required field'),
      fieldComponent: InputTextFieldWithRef,
      fieldComponentProps: {
        type: 'email',
      } as InputTextFieldProps,
    },
  ],
};

export default componentMeta;
