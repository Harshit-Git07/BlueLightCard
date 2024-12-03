import { ServiceLayerMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/ServiceLayerMemberProfile';
import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';
import { useCallback } from 'react';

type Callback = () => Promise<ServiceLayerMemberProfile | undefined>;

export function useGetMemberProfile(): Callback {
  return useCallback(async () => {
    try {
      const result = await fetch(`${serviceLayerUrl}/members/profile`);
      const body = JSON.parse(await result.text());
      if (result.status !== 200) {
        console.error(
          'Got an invalid response from service layer when requesting the member profile',
          body
        );
        return undefined;
      }

      return body;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }, []);
}
