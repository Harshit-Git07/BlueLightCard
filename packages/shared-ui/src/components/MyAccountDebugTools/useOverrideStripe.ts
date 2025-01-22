import { mockMemberProfileResponse } from './mocks/mockMemberProfileGet';
import { useStripeClient } from '../../hooks/useStripeClient';
import { useQueryClient } from '@tanstack/react-query';
import { PaymentIntentResult } from '@stripe/stripe-js';
import { useEffect } from 'react';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';

const stripeTestKey =
  'pk_test_51QACN4S9N5NHrlGYTj7qmy768u9A2lqFqL2AWQbOX3tbJhJO3tjDS74KuBcOwyiz6Dov35tox4aMi97bWX4Z2MCM00boCBdcYs';

export const useOverrideStripe = (enabled: boolean, willSucceed: boolean) => {
  const queryClient = useQueryClient();
  const stripeClient = useStripeClient(stripeTestKey);
  useEffect(() => {
    if (!enabled || !stripeClient) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    stripeClient.confirmPayment = async () => {
      mockMemberProfileResponse.applications[0].eligibilityStatus =
        EligibilityStatus.AWAITING_ID_APPROVAL;
      mockMemberProfileResponse.cards[0].paymentStatus = willSucceed
        ? PaymentStatus.PAID_CARD
        : PaymentStatus.AWAITING_PAYMENT;
      await queryClient.invalidateQueries({ queryKey: ['memberProfile'] });

      if (!willSucceed) return { success: false, error: { message: 'Something went wrong' } };

      return { success: true } as unknown as PaymentIntentResult;
    };
  }, [enabled, willSucceed, stripeClient]);
};
