import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ServiceLayerMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-member-profile/types/ServiceLayerMemberProfile';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { refreshIdTokenIfRequired } from '@/utils/refreshIdTokenIfRequired';

type Callback = () => Promise<ServiceLayerMemberProfile | undefined>;

export function useGetMemberProfile(): Callback {
  return useCallback(async () => {
    try {
      // TODO: This needs to be updated to use platform adapter when used in mobile hybrid.
      // TODO: We avoided doing this as the initial team as we had no experience with it and this was added in 2 days before we rolled off
      // const result = await fetch(`${serviceLayerUrl}/members/profile`);
      // const result = await fetch(`${serviceLayerUrl}/members/19921f4f-9d17-11ef-b68d-506b8d536548/profile`); // TODO: Remove this later, just here to test real profiles

      const idToken = await refreshIdTokenIfRequired();
      const result = await fetch(`${serviceLayerUrl}/members/profile`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

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
      return undefined;
    }
  }, []);
}

export function useMemberProfile(): ServiceLayerMemberProfile | undefined {
  const getMemberProfile = useGetMemberProfile();

  const memberProfileResult = useQuery({
    queryKey: ['memberProfile'],
    queryFn: getMemberProfile,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return useMemo(() => {
    if (memberProfileResult.status !== 'success' || !memberProfileResult.data) return undefined;

    return memberProfileResult.data;

    // TODO: Remove this when the service layer is ready, for now we can uncomment it for demo purposes
    // return {
    //   applications: [
    //     {
    //       eligibilityStatus: 'NOT ELIGIBLE',
    //     },
    //   ],
    // } as unknown as ServiceLayerMemberProfile;
  }, [memberProfileResult.data, memberProfileResult.status]);
}
