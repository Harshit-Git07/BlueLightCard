import { Decorator } from '@storybook/react';
import { IPlatformAdapter, PlatformAdapterProvider } from './PlatformAdapter';
import { PlatformVariant } from '../types';

export const storybookPlatformAdapter: IPlatformAdapter = {
  getAmplitudeFeatureFlag: () => 'control',
  invokeV5Api: () => Promise.resolve({ status: 200, data: '{}' }),
  logAnalyticsEvent: () => {},
  navigate: () => {},
  navigateExternal: () => ({
    isOpen: () => true,
  }),
  writeTextToClipboard: () => Promise.resolve(),
  getBrandURL: () => '',
  platform: PlatformVariant.MobileHybrid,
} satisfies IPlatformAdapter;

export const StorybookPlatformAdapterDecorator: Decorator = (Story, { parameters }) => {
  const platformAdapter = {
    ...storybookPlatformAdapter,
    ...parameters.platformAdapter,
  };

  return (
    <PlatformAdapterProvider adapter={platformAdapter}>
      <Story platformAdapter={platformAdapter} />
    </PlatformAdapterProvider>
  );
};
