import { Decorator } from '@storybook/react';
import { SharedUIConfigProvider } from './SharedUiConfigProvider';

export const StorybookSharedUIConfigDecorator: Decorator = (Story, { parameters }) => {
  const globalConfig = {
    cdnUrl: 'https://cdn.bluelightcard.co.uk',
    brand: 'blc-uk',
    ...parameters.sharedUIConfig,
  };

  return (
    <SharedUIConfigProvider value={{ globalConfig }}>
      <Story />
    </SharedUIConfigProvider>
  );
};
