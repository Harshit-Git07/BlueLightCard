import { Meta, StoryFn } from '@storybook/react';
import ValidationMessage, { Props } from '.';
import { borders, colours } from '../../tailwind/theme';

export default {
  title: 'Component System/Validation Message',
  component: ValidationMessage,
  decorators: [(Story) => <Story />],
} as Meta;

const Template: StoryFn<Props> = (args) => {
  return (
    <>
      <input
        className={`h-[50px] rounded-md px-3 ${colours.backgroundSurface} ${borders.default}`}
        value="Mock input"
        disabled={args.isDisabled}
      />
      <ValidationMessage {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  message: 'Some information about an input',
  htmlFor: 'associated-element-id',
  isValid: undefined,
  isDisabled: false,
};

export const Valid = Template.bind({});
Valid.args = {
  message: 'Input value is valid',
  htmlFor: 'associated-element-id',
  isValid: true,
  isDisabled: false,
};

export const Invalid = Template.bind({});
Invalid.args = {
  message: 'Input value is invalid',
  htmlFor: 'associated-element-id',
  isValid: false,
  isDisabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  message: 'Input is invalid (but also disabled)',
  htmlFor: 'associated-element-id',
  isValid: false,
  isDisabled: true,
};
