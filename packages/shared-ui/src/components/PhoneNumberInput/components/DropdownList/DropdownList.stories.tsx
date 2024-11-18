import { Meta, StoryFn } from '@storybook/react';
import DropdownList, { Props as DropdownProps } from '.';
import { defaultCountries, parseCountry } from 'react-international-phone';
import type { FC } from 'react';

const countries = defaultCountries.map(parseCountry);

type WrapperProps = { numberOfItems: number } & DropdownProps;
const WrapperComponent: FC<WrapperProps> = ({ numberOfItems, selectedCountryCode, ...props }) => (
  <DropdownList
    {...props}
    selectedCountryCode={selectedCountryCode}
    listOfCountries={[
      defaultCountries.find((c) => c[1] === selectedCountryCode)!,
      ...defaultCountries.slice(0, numberOfItems),
    ]}
  />
);

const availableCodes = countries.map((country) => country.iso2);

const componentMeta: Meta<WrapperProps> = {
  title: 'Component System/PhoneNumberInput/DropdownList',
  component: WrapperComponent,
  argTypes: {
    selectedCountryCode: {
      control: 'select',
      options: availableCodes,
    },
  },
};

const WrapperTemplate: StoryFn<WrapperProps> = (args) => <WrapperComponent {...args} />;

export const Default = WrapperTemplate.bind({});

Default.args = {
  dropdownOpen: true,
  selectedCountryCode: countries[0].iso2,
  itemOnClick: () => undefined,
  numberOfItems: 6,
};

Default.argTypes = {
  numberOfItems: {
    control: {
      type: 'range',
      min: 1,
      max: 10,
      step: 1,
    },
  },
};

const DropdownTemplate: StoryFn<DropdownProps> = (args) => <DropdownList {...args} />;

export const FullExample = DropdownTemplate.bind({});

FullExample.args = {
  dropdownOpen: true,
  selectedCountryCode: countries[0].iso2,
  listOfCountries: defaultCountries,
  itemOnClick: () => undefined,
};

export const LengthOneExample = DropdownTemplate.bind({});

LengthOneExample.args = {
  dropdownOpen: true,
  selectedCountryCode: countries[0].iso2,
  listOfCountries: [defaultCountries[0]],
  itemOnClick: () => undefined,
};

export default componentMeta;
