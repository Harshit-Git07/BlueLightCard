import { Meta, StoryFn } from '@storybook/react';
import InputField from './InputField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/pro-regular-svg-icons';
import { VALIDATION_ENUM } from '@/app/_zodSchemas/validationEnum';

const componentMeta: Meta<typeof InputField> = {
  title: 'member-services-hub/InputField',
  component: InputField,
};

const Template: StoryFn<typeof InputField> = (args) => <InputField {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'Label',
};

export const InputFieldPasswordValidation = Template.bind({});

InputFieldPasswordValidation.args = {
  label: 'Label',
  disabled: false,
  placeholder: 'placeholder text...',
  icon: <FontAwesomeIcon icon={faIdCard} />,
  width: '100%',
  validationType: VALIDATION_ENUM.PASSWORD,
  validationSuccessMessage: 'Password Strong!',
};

export default componentMeta;
