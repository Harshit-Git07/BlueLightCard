import useDrawer from '../Drawer/useDrawer';
import {
  PlatformAdapterProvider,
  storybookPlatformAdapter,
  V5RequestOptions,
  V5Response,
} from '../../adapters';
import { FC, ReactElement, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import Drawer from '../Drawer';
import Button from '../Button-V2';
import { createQueryClient } from '../../utils/storyUtils';

interface StoryDrawerWrapper {
  minHeight?: number;
  content: ReactElement;
  invokeV5Api?: (url: string, options: V5RequestOptions) => Promise<V5Response>;
  responseDelay?: number;
}

const StoryDrawerWrapper: FC<StoryDrawerWrapper> = ({
  content,
  minHeight = 600,
  responseDelay = 1000,
  invokeV5Api,
}) => {
  const { open } = useDrawer();
  const adapter = { ...storybookPlatformAdapter };
  adapter.invokeV5Api = async (url, options) => {
    if (responseDelay) {
      await new Promise((accept) => setTimeout(accept, responseDelay));
    }
    if (invokeV5Api) {
      console.log('invokeV5Api', options);
      return invokeV5Api(url, options);
    }

    return Promise.resolve({
      status: 200,
      data: 'ok',
    });
  };

  useEffect(() => {
    open(content);
  }, [content]);

  return (
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={createQueryClient()}>
        <div style={{ minHeight: minHeight }}>
          <Drawer />
          <Button onClick={() => open(content)}>Open drawer</Button>
        </div>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};

export default StoryDrawerWrapper;
