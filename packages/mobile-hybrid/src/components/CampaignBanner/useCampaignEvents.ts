import { useCallback, useEffect, useState } from 'react';
import { V5_API_URL } from '@/globals';
import { IPlatformAdapter } from '@bluelightcard/shared-ui';
import type { CampaignEvent } from './types';

const useCampaignEvents = (platformAdapter: IPlatformAdapter) => {
  const [campaignEvents, setCampaignEvents] = useState<CampaignEvent[]>([]);

  const getCampainEvents = useCallback(async () => {
    try {
      const response = await platformAdapter.invokeV5Api(V5_API_URL.CampaignEvents, {
        method: 'GET',
        queryParameters: {
          active: 'true',
          // type is currently hardcoded for the thank you campaign, we may support other types in future
          type: 'thankyouCampaign',
        },
      });

      const parsedResponse = JSON.parse(response.data).data as CampaignEvent[];
      if (!parsedResponse) throw new Error('Empty campaign event response received');

      setCampaignEvents(parsedResponse);
    } catch (err) {
      console.error('Error requesting campaign events', err);
    }
  }, [platformAdapter, setCampaignEvents]);

  useEffect(() => {
    getCampainEvents();
  }, [getCampainEvents]);

  return campaignEvents;
};

export default useCampaignEvents;
