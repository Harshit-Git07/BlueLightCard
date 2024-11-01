import { Meta, StoryFn } from '@storybook/react';
import ClickableFlag from './ClickableFlag';
import { defaultCountries, parseCountry } from 'react-international-phone';

const ukCountry = defaultCountries.map(parseCountry).find((country) => country.iso2 === 'gb')!;

const componentMeta: Meta<typeof ClickableFlag> = {
  title: 'Component System/PhoneNumberInput/ClickableFlag',
  component: ClickableFlag,
};

const DefaultTemplate: StoryFn<typeof ClickableFlag> = (args) => <ClickableFlag {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  country: ukCountry,
  isOpen: false,
  toggleDropdown: () => undefined,
};

export const IsOpen = DefaultTemplate.bind({});

IsOpen.args = {
  country: ukCountry,
  isOpen: true,
  toggleDropdown: () => undefined,
};

export default componentMeta;
