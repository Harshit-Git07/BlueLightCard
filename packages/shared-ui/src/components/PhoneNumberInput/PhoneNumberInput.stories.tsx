import { Meta, StoryFn } from '@storybook/react';
import PhoneNumberInput from './';
import { CountryIso2, defaultCountries, parseCountry } from 'react-international-phone';

const countryList: Array<CountryIso2 | undefined> = defaultCountries
  .map(parseCountry)
  .map((parsedCountry) => parsedCountry.iso2);

const componentMeta: Meta<typeof PhoneNumberInput> = {
  title: 'Component System/PhoneNumberInput',
  component: PhoneNumberInput,
  argTypes: {
    value: {
      control: 'text',
      description: '`string`: The phone number. (default: `""`)',
    },
    isDisabled: {
      control: 'boolean',
      description: '`boolean`: Whether the input is disabled. (default: `false`)',
    },
    defaultCountry: {
      control: 'select',
      options: countryList,
      description:
        '`string`: The default country code. (default: `gb or ua depending on local but to add more countries needs to be updated`)',
    },
    label: {
      control: 'text',
      description: '`string`: Label text for the input. (default: `""`)',
    },
    description: {
      control: 'text',
      description: '`string`: Description that shows in the tooltip. (default: `""`)',
    },
    onChange: {
      action: 'changed',
      description: '`function`: Callback triggered when the value changes.',
    },
    isSelectable: {
      control: 'boolean',
      description: '`boolean`: Whether the country selector is clickable. (default: `false`)',
    },
    validationMessage: {
      control: 'text',
      description:
        '`string`: Additional message text. Used for displaying errors in combination with `isValid`. (default: `""`)',
    },
    isValid: {
      control: 'boolean',
      description:
        '`boolean`: Describes the state that the input is in; `false` for an error state.',
    },
  },
};

const DefaultTemplate: StoryFn<typeof PhoneNumberInput> = (args) => <PhoneNumberInput {...args} />;

export const Default = DefaultTemplate.bind({});
Default.args = {
  value: '+44',
};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = {
  ...Default.args,
  isDisabled: true,
};

export const ClickableDropdown = DefaultTemplate.bind({});
ClickableDropdown.args = {
  ...Default.args,
  isSelectable: true,
};

ClickableDropdown.decorators = [
  (Story) => (
    <div
      style={{
        height: '300px',
        margin: '0 auto',
      }}
    >
      <Story />
    </div>
  ),
];

export const Labelled = DefaultTemplate.bind({});
Labelled.args = {
  ...Default.args,
  label: 'Phone Number',
};

export const LabelledWithError = DefaultTemplate.bind({});
LabelledWithError.args = {
  ...Default.args,
  label: 'Phone Number',
  isValid: false,
};

export default componentMeta;
