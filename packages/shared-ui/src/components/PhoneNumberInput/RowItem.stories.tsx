import { Meta, StoryFn } from '@storybook/react';
import RowItem from './RowItem';
import { defaultCountries, parseCountry } from 'react-international-phone';

const ukCountry = defaultCountries.map(parseCountry).find((country) => country.iso2 === 'gb')!;

const componentMeta: Meta<typeof RowItem> = {
  title: 'Component System/PhoneNumberInput/RowItem',
  component: RowItem,
  decorators: [
    (Story) => (
      <ul aria-label="wrapper" className={'p-2 bg-colour-surface dark:bg-colour-surface-dark'}>
        <Story />
      </ul>
    ),
  ],
};

const DefaultTemplate: StoryFn<typeof RowItem> = (args) => <RowItem {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  ...ukCountry,
};

export default componentMeta;
