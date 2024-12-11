import { usePlatformAdapter } from '../adapters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jsonOrNull } from '../utils/jsonUtils';
import { ApplicationSchema } from '../components/CardVerificationAlerts/types';

export interface MemberApplicationPostResponse {
  applicationId: string;
}

export const urlMemberApplication = (memberId: string) => `/members/${memberId}/applications`;

const useMemberApplicationPost = (memberId: string) => {
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (updates: Partial<ApplicationSchema>) => {
      const { applicationReason } = updates;
      try {
        const { status, data } = await adapter.invokeV5Api(urlMemberApplication(memberId), {
          method: 'POST',
          body: JSON.stringify({
            applicationReason,
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
