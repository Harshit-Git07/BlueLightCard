import { useQuery } from '@tanstack/react-query';
import { usePlatformAdapter } from '../adapters';
import { jsonOrNull } from '../utils/jsonUtils';
import { MemberProfile } from '../api/types';
import { V5_API_URL } from '../constants';
import useMemberUuidAtom from '../components/MyAccountDebugTools/useMemberAtom';

type GETSuccessResponse = {
  type: 'success';
  status: number;
  profile: MemberProfile;
};

type GETErrorResponse = {
  type: 'error';
  message: string;
};

export const useMemberProfileGet = () => {
  const { atomMemberUuid } = useMemberUuidAtom();

  const adapter = usePlatformAdapter();
  const query = useQuery({
    queryKey: ['memberProfile', atomMemberUuid],
    queryFn: async (): Promise<GETSuccessResponse | GETErrorResponse> => {
      try {
        const { status, data } = await adapter.invokeV5Api(
          V5_API_URL.Profile(atomMemberUuid ?? undefined),
          {
            method: 'GET',
            queryParameters: {},
          },
        );

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
    staleTime: 1000 * 60 * 10,
  });

  const memberProfile = query.data?.type === 'success' ? query.data.profile : null;
  return { ...query, memberProfile };
};

export default useMemberProfileGet;
