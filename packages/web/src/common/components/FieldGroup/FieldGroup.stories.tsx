import { faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { Meta, StoryFn } from '@storybook/react';
import InputTextField from '@/components/InputTextField/InputTextField';
import FieldGroup from './FieldGroup';

/**
 * **IMPORTANT:** This has been deprecated - please use /packages/shared-ui/src/components/PasswordInput/index.tsx
 *
 * @deprecated Please read the above note carefully.
 */
const componentMeta: Meta<typeof FieldGroup> = {
  title: 'Deprecated/Component System/Form/Field Group - Deprecated',
  component: FieldGroup,
  argTypes: {
    invalid: {
      description: 'Toggle invalid state of component',
    },
    message: {
      description: 'Small message text',
    },
  },
};

const FieldGroupTemplate: StoryFn<typeof FieldGroup> = (args) => {
  const showSuccessState = args.password && !args.invalid;
  return (
    <FieldGroup {...args}>
      <InputTextField
        success={showSuccessState}
        error={args.invalid}
        placeholder="Placeholder text"
        icon={faEnvelope}
        type={args.passwordVisible ? 'text' : 'password'}
      />
    </FieldGroup>
  );
};

export const Default = FieldGroupTemplate.bind({});

Default.args = {
  labelText: 'Field Group',
  invalid: false,
  message: 'Message',
  password: false,
  passwordVisible: false,
};

export const PasswordWeak = FieldGroupTemplate.bind({});

PasswordWeak.args = {
  labelText: 'Field Group',
  invalid: true,
  message: [
    { message: 'One lowercase character', invalid: true },
    { message: 'One uppercase character', invalid: true },
    { message: 'One number', invalid: false },
  ],
  password: true,
  passwordVisible: false,
};

export const PasswordStrong = FieldGroupTemplate.bind({});

PasswordStrong.args = {
  labelText: 'Field Group',
  invalid: false,
  message: [
    { message: 'One lowercase character', invalid: false },
    { message: 'One uppercase character', invalid: false },
    { message: 'One number', invalid: false },
  ],
  password: true,
  passwordVisible: false,
};

export default componentMeta;
