import RequestNewCard from './index';
import { Meta, StoryFn } from '@storybook/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '../../utils/storyUtils';
import Drawer from '../Drawer';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '../../adapters';
import RequestNewCardButton from './RequestNewCardButton';
import RequestNewCardDebug from '../MyAccountDebugTools';
import { setupMocks } from '../MyAccountDebugTools/mocks/setupMocks';
import Toaster from '../Toast/Toaster';

const componentMeta: Meta<typeof RequestNewCard> = {
  title: 'Organisms/Request New Card',
  component: RequestNewCard,
};

const DefaultTemplate: StoryFn<typeof RequestNewCard> = () => {
  const adapter = { ...storybookPlatformAdapter };
  setupMocks(adapter, true);
  return (
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={createQueryClient()}>
        <div style={{ minHeight: 800 }}>
          <Drawer />
          <Toaster />
          <RequestNewCardButton />
          <RequestNewCardDebug />
        </div>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
