import { Decorator } from '@storybook/react';
import { IPlatformAdapter, PlatformAdapterProvider } from './PlatformAdapter';
import { PlatformVariant } from '../types';

export const StorybookPlatformAdapterDecorator: Decorator = (Story, { parameters }) => {
  const storybookPlatformAdapter = {
    getAmplitudeFeatureFlag: () => 'control',
    invokeV5Api: (path: string) => Promise.resolve({ statusCode: 200, body: '{}' }),
    logAnalyticsEvent: () => {},
    navigate: () => {},
    navigateExternal: () => {},
    platform: PlatformVariant.MobileHybrid,
    ...parameters.platformAdapter,
  } satisfies IPlatformAdapter;

  return (
    <PlatformAdapterProvider adapter={storybookPlatformAdapter}>
      <Story platformAdapter={storybookPlatformAdapter} />
    </PlatformAdapterProvider>
  );
};
