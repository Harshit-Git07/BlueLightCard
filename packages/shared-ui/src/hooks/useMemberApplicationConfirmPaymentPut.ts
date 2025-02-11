import { usePlatformAdapter } from '../adapters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { V5_API_URL } from '../constants';

const useMemberApplicationConfirmPaymentPut = (memberId: string, applicationId: string) => {
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();

  return useMutation({
    mutationFn: async () => {
      try {
        const { status } = await adapter.invokeV5Api(
          `${V5_API_URL.PaymentConfirmed(memberId, applicationId)}`,
          {
            method: 'PUT',
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

export default useMemberApplicationConfirmPaymentPut;
