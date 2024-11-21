import { Meta, StoryFn } from '@storybook/react';
import YourCard from './index';
import { IPlatformAdapter, PlatformAdapterProvider } from '../../adapters';
import { PlatformVariant } from '../../types';

export default {
  title: 'Component System/YourCard',
  component: YourCard,
  argTypes: {
    expiryDate: { table: { disable: true } },
  },
} as Meta;

const mockPlatformAdapter = {
  getAmplitudeFeatureFlag: () => 'control',
  invokeV5Api: () =>
    Promise.resolve({ status: 200, data: "{ data: { redemptionType: 'vault' } }" }),
  logAnalyticsEvent: () => {},
  navigate: () => {},
  navigateExternal: () => ({
    isOpen: () => true,
  }),
  writeTextToClipboard: () => Promise.resolve(),
  getBrandURL: () => 'https://bluelightcard.co.uk',
  platform: PlatformVariant.Web,
} satisfies IPlatformAdapter;

const Template: StoryFn<typeof YourCard> = (args) => (
  <PlatformAdapterProvider adapter={mockPlatformAdapter}>
    <YourCard {...args} />
  </PlatformAdapterProvider>
);

const firstName = 'Name';
const lastName = 'Last-name';
const accountNumber = 'BLC0000000';
const expiryDate = '2024-12-12T00:00:00Z';

export const BlcDefault = Template.bind({});
BlcDefault.args = {
  brand: 'blc-uk',
  firstName,
  lastName,
  accountNumber,
  expiryDate,
};

export const BlcNotGenerated = Template.bind({});
BlcNotGenerated.args = {
  brand: 'blc-uk',
  firstName,
  lastName,
  expiryDate,
};

export const DdsDefault = Template.bind({});
DdsDefault.args = {
  brand: 'dds-uk',
  firstName,
  lastName,
  accountNumber,
  expiryDate,
};

export const DdsNotGenerated = Template.bind({});
DdsNotGenerated.args = {
  brand: 'dds-uk',
  firstName,
  lastName,
  expiryDate,
};
