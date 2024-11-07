import { Meta, StoryFn } from '@storybook/react';
import CopyButton, { Props } from './CopyButton';
import { PlatformVariant, ThemeVariant } from '../../types';
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
  platform: PlatformVariant.MobileHybrid,
} satisfies IPlatformAdapter;

const Template: StoryFn<Props> = (args) => (
  <PlatformAdapterProvider adapter={mockPlatformAdapter}>
    <CopyButton {...args} />
  </PlatformAdapterProvider>
);

const label = 'Copy card number';
const copyText = 'BLC0000000';

export const TertiaryEnabled = Template.bind({});
TertiaryEnabled.args = {
  variant: ThemeVariant.Tertiary,
  label,
  copyText,
  disabled: false,
};

export const TertiaryDisabled = Template.bind({});
TertiaryDisabled.args = {
  variant: ThemeVariant.Tertiary,
  label,
  copyText,
  disabled: true,
};

export const PrimaryEnabled = Template.bind({});
PrimaryEnabled.args = {
  variant: ThemeVariant.Primary,
  label,
  copyText,
  disabled: false,
};

export const PrimaryDisabled = Template.bind({});
PrimaryDisabled.args = {
  variant: ThemeVariant.Primary,
  label,
  copyText,
  disabled: true,
};

export const PrimaryStretched = Template.bind({});
PrimaryStretched.args = {
  variant: ThemeVariant.Primary,
  label,
  copyText,
  fullWidth: true,
  disabled: false,
};
