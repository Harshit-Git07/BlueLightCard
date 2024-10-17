import { Meta, StoryFn } from '@storybook/react';
import PasswordInput from './';
import { FC, useState } from 'react';
import { usePasswordValidation } from 'src/hooks/usePasswordValidation';

const componentMeta: Meta<typeof PasswordInput> = {
  title: 'Component System/PasswordInput',
  component: PasswordInput,
  argTypes: {
    password: { control: { disable: true } },
    isValid: { control: { disable: true } },
    infoMessage: { control: { disable: true } },
  },
};

// Allows us to mock component states as it will be used.
const ImplementedPasswordInput: FC = (args) => {
  const { validatePassword } = usePasswordValidation();
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | undefined>(undefined);
  const [password, setPassword] = useState('');

  const handleOnSetPassword = (input: string) => {
    const isValid = validatePassword(input);
    setPassword(input);
    setIsPasswordValid(isValid);
    console.log('Set password: ', input);
    console.log('Set is valid password: ', isValid);
  };

  return (
    <form>
      <PasswordInput
        {...args}
        password={password}
        infoMessage={isPasswordValid ? 'Password is valid' : 'Password is invalid'}
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
  showIcon: true,
  helpMessage: 'Start typing to see dynamic validation',
  hideRequirements: false,
  isDisabled: false,
};
Disabled.args = { isDisabled: true };

export default componentMeta;
