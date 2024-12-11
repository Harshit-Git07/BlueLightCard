import { usePlatformAdapter } from '../adapters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApplicationSchema } from '../components/CardVerificationAlerts/types';

const useMemberApplicationPut = (memberId: string, applicationId: string) => {
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (updates: Partial<ApplicationSchema>) => {
      try {
        const { status } = await adapter.invokeV5Api(
          `/members/${memberId}/applications/${applicationId}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              ...updates,
              memberId,
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
      await queryClient.invalidateQueries({ queryKey: ['memberProfile', memberId] });
    },
  });
};

export default useMemberApplicationPut;
