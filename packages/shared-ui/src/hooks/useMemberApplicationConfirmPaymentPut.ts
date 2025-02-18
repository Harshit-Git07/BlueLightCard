import { usePlatformAdapter } from '../adapters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { V5_API_URL } from '../constants';
import useMemberId from './useMemberId';

const useMemberApplicationConfirmPaymentPut = (applicationId: string) => {
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();
  const memberId = useMemberId();

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
      await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
    },
  });
};

export default useMemberApplicationConfirmPaymentPut;
