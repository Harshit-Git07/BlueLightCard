import { Meta, StoryFn } from '@storybook/react';
import CopyButton, { Props } from './CopyButton';
import { PlatformVariant } from '../../types';
import { IPlatformAdapter, PlatformAdapterProvider } from '../../adapters';

export default {
  title: 'Component System/CopyButton',
  component: CopyButton,
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

const Template: StoryFn<Props> = (args) => (
  <PlatformAdapterProvider adapter={mockPlatformAdapter}>
    <CopyButton {...args} />
  </PlatformAdapterProvider>
);

export const Default = Template.bind({});
Default.args = {
  copyText: 'BLC0000000',
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  copyText: 'BLC0000000',
  disabled: true,
};
