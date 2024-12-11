import { useQuery } from '@tanstack/react-query';
import { usePlatformAdapter } from '../adapters';
import { jsonOrNull } from '../utils/jsonUtils';
import { V5_API_URL } from 'client/src/common/globals/apiUrl';
import { MemberProfile } from '../api/types';

type GETSuccessResponse = {
  type: 'success';
  status: number;
  profile: MemberProfile;
};

type GETErrorResponse = {
  type: 'error';
  message: string;
};

export const useMemberProfileGet = (memberId: string) => {
  const adapter = usePlatformAdapter();
  const query = useQuery({
    queryKey: ['memberProfile', memberId],
    queryFn: async (): Promise<GETSuccessResponse | GETErrorResponse> => {
      try {
        const { status, data } = await adapter.invokeV5Api(V5_API_URL.Profile(memberId), {
          method: 'GET',
          queryParameters: {},
        });

        const profile = jsonOrNull<MemberProfile>(data);
        if (profile) {
          return {
            type: 'success',
            status,
            profile: profile,
          };
        } else {
          return {
            type: 'error',
            message: 'Unknown error occurred',
          };
        }
      } catch (e) {
        return {
          type: 'error',
          message: 'Unknown error occurred',
        };
      }
    },
    staleTime: 10000,
    enabled: memberId.length !== 0,
  });

  const memberProfile = query.data?.type === 'success' ? query.data.profile : null;
  return { ...query, memberProfile };
};

export default useMemberProfileGet;
