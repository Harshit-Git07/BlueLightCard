import { Meta, StoryFn } from '@storybook/react';
import PasswordInput from './';
import { ChangeEvent, FC, useState } from 'react';
import { usePasswordValidation } from 'src/hooks/usePasswordValidation';

const componentMeta: Meta<typeof PasswordInput> = {
  title: 'Component System/PasswordInput',
  component: PasswordInput,
  argTypes: {
    value: { control: { disable: true } },
    isValid: { control: { disable: true } },
    validationMessage: { control: { disable: true } },
  },
};

// Allows us to mock component states as it will be used.
const ImplementedPasswordInput: FC = (args) => {
  const { validatePassword } = usePasswordValidation();
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>(undefined);
  const [password, setPassword] = useState('');

  const handleOnSetPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const isValid = validatePassword(input);
    setPassword(input);
    setIsPasswordValid(isValid);
  };

  return (
    <form>
      <PasswordInput
        {...args}
        value={password}
        validationMessage={isPasswordValid ? 'Password is valid' : 'Password is invalid'}
        onChange={handleOnSetPassword}
        isValid={isPasswordValid}
      />
    </form>
  );
};

const DefaultTemplate: StoryFn = (args) => <ImplementedPasswordInput {...args} />;

export const Default = DefaultTemplate.bind({});
export const Disabled = DefaultTemplate.bind({});

Default.args = {
  label: 'Password',
  placeholder: 'Password',
  hideRequirements: false,
  isDisabled: false,
};
Disabled.args = { isDisabled: true };

export default componentMeta;
