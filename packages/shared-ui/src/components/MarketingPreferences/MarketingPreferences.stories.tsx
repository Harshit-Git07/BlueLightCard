import MarketingPreferences from './index';
import { Meta, StoryFn } from '@storybook/react';
import Toaster from '../Toast/Toaster';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '../../adapters';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '../../utils/storyUtils';
import {
  defaultPrefBlazeData,
  MarketingPreferencesPutPayload,
  MarketingPreferencesPutPayloadNameValue,
} from './MarketingPreferencesTypes';
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
  const [putPayload, setPutPayload] = useState<MarketingPreferencesPutPayload>();
  const [putResponse, setPutResponse] = useState<Response>();
  const adapter = { ...storybookPlatformAdapter };
  adapter.invokeV5Api = async (url, options) => {
    if (options.method === 'PUT') {
      const json = jsonOrNull<MarketingPreferencesPutPayload>(options?.body ?? '');
      setPutPayload(json ?? undefined);
      const analytics = json?.preferences.find(
        (p: MarketingPreferencesPutPayloadNameValue) => p.name === 'sms_subscribe',
      );

      if (analytics?.value === 'opted_in') {
        const result = {
          status: 400,
          data: JSON.stringify({ errors: [] }),
        };
        setPutResponse(result);
        return Promise.resolve(result);
      }
      const result = {
        status: 200,
        data: JSON.stringify({ messages: [] }),
      };
      setPutResponse(result);
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

          <p>PUT payload</p>
          <pre>{JSON.stringify(putPayload, null, '  ')}</pre>

          <p>PUT response</p>
          <pre>{JSON.stringify(putResponse, null, '  ')}</pre>
        </div>
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};
