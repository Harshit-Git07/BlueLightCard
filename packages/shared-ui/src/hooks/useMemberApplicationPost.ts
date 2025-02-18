import { usePlatformAdapter } from '../adapters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jsonOrNull } from '../utils/jsonUtils';
import { ApplicationSchema } from '../components/CardVerificationAlerts/types';
import { V5_API_URL } from '../constants';
import useMemberId from './useMemberId';

export interface MemberApplicationPostResponse {
  applicationId: string;
}

const useMemberApplicationPost = () => {
  const memberId = useMemberId();
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();

  return useMutation({
    mutationFn: async (updates: Partial<ApplicationSchema>) => {
      const { applicationReason, reorderCardReason } = updates;
      try {
        const { status, data } = await adapter.invokeV5Api(V5_API_URL.Application(memberId), {
          method: 'POST',
          body: JSON.stringify({
            eligibilityStatus: applicationReason === 'REPRINT' ? 'ELIGIBLE' : 'INELIGIBLE',
            applicationReason,
            reorderCardReason,
            memberId,
          }),
        });

        return {
          status,
          data: jsonOrNull<MemberApplicationPostResponse>(data),
        };
      } catch (err) {
        return {
          status: 500,
          data: { error: 'Unknown error occurred' },
        };
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['memberProfile', memberId] });
    },
  });
};

export default useMemberApplicationPost;
