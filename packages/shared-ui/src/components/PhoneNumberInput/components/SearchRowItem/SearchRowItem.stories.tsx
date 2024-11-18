import { Meta, StoryFn } from '@storybook/react';
import SearchRowItem from '.';
import { defaultCountries, parseCountry } from 'react-international-phone';

const ukCountry = defaultCountries.map(parseCountry).find((country) => country.iso2 === 'gb')!;

const componentMeta: Meta<typeof SearchRowItem> = {
  title: 'Component System/PhoneNumberInput/SearchRowItem',
  component: SearchRowItem,
};

const DefaultTemplate: StoryFn<typeof SearchRowItem> = (args) => <SearchRowItem {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  placeholderName: ukCountry.name,
  searchText: '',
  onChange: () => undefined,
  ...ukCountry,
};

export default componentMeta;
