import MarketingPreferences from './index';
import { Meta, StoryFn } from '@storybook/react';
import Toaster from '../Toast/Toaster';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '../../adapters';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '../../utils/storyUtils';
import { defaultPrefBlazeData, MarketingPreferencesPostModel } from './types';
import { jsonOrNull } from '../../utils/jsonUtils';
import { useState } from 'react';
import { fonts } from '../../tailwind/theme';

interface Response {
  status: number;
  data: string;
}

const componentMeta: Meta<typeof MarketingPreferences> = {
  title: 'Organisms/Marketing Preferences',
  component: MarketingPreferences,
};
export default componentMeta;

export const Example: StoryFn<typeof MarketingPreferences> = () => {
  const [getResponse, setGetResponse] = useState<Response>();
  const [postPayload, setPostPayload] = useState<MarketingPreferencesPostModel>();
  const [postResponse, setPostResponse] = useState<Response>();
  const adapter = { ...storybookPlatformAdapter };
  adapter.invokeV5Api = async (_, options) => {
    if (options.method === 'POST') {
      const json = jsonOrNull<MarketingPreferencesPostModel>(options?.body ?? '');
      setPostPayload(json ?? undefined);
      const sms = json?.attributes['sms_subscribe'];

      if (sms === 'opted_in') {
        const result = {
          status: 400,
          data: JSON.stringify({ errors: [] }),
        };
        setPostResponse(result);
        return Promise.resolve(result);
      }
      const result = {
        status: 200,
        data: JSON.stringify({ messages: [] }),
      };
      setPostResponse(result);
      return Promise.resolve(result);
    }

    const result = {
      status: 200,
      data: JSON.stringify({
        success: true,
        data: { ...defaultPrefBlazeData, feedback: 'opted_in' },
      }),
    };
    setGetResponse(result);
    return Promise.resolve(result);
  };

  return (
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={createQueryClient()}>
        <Toaster />
        <div className={'max-w-[847px]'}>
          <MarketingPreferences memberUuid={'Batman'} />
        </div>
        <div className={`${fonts.bodySmall} pt-[50px]`}>
          <p>GET response</p>
          <pre>{JSON.stringify(getResponse, null, '  ')}</pre>

          <p>POST payload</p>
          <pre>{JSON.stringify(postPayload, null, '  ')}</pre>

          <p>POST response</p>
          <pre>{JSON.stringify(postResponse, null, '  ')}</pre>
        </div>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};
