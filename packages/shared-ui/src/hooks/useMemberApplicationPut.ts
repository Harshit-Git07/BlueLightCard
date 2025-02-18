import { usePlatformAdapter } from '../adapters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationSchema } from '../components/CardVerificationAlerts/types';
import { V5_API_URL } from '../constants';
import useMemberApplication from './useMemberApplication';
import useMemberId from './useMemberId';

const useMemberApplicationPut = (applicationId: string) => {
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();
  const memberId = useMemberId();
  const { application } = useMemberApplication();

  const fieldsRequiredForPut = {
    memberId,
    applicationId,
    applicationReason: application?.applicationReason,
    reorderCardReason: application?.reorderCardReason,
  };

  return useMutation({
    mutationFn: async (updates: Partial<ApplicationSchema>) => {
      try {
        const { status } = await adapter.invokeV5Api(
          `${V5_API_URL.Application(memberId)}/${applicationId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              ...fieldsRequiredForPut,
              ...updates,
            }),
          },
        );

        return {
          status,
          data: {},
        };
      } catch (err) {
        return {
          status: 500,
          data: { error: 'Unknown error occurred' },
        };
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
    },
  });
};

export default useMemberApplicationPut;
