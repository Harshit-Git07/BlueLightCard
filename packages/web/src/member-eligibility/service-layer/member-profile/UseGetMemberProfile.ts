import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';
import { useCallback, useMemo } from 'react';
import { ServiceLayerMemberProfile } from '@/root/src/member-eligibility/service-layer/member-profile/types/ServiceLayerMemberProfile';
import { useQuery } from '@tanstack/react-query';

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

export function useMemberProfile(): ServiceLayerMemberProfile | undefined {
  const getMemberProfile = useGetMemberProfile();

  const memberProfileResult = useQuery({
    queryKey: ['memberProfile'],
    queryFn: getMemberProfile,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  console.log(memberProfileResult);

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
