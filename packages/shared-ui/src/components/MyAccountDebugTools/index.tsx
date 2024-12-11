import useRequestNewCard from '../RequestNewCard/useRequestNewCard';
import { colours } from '../../tailwind/theme';
import { usePlatformAdapter } from '../../adapters';
import { useQueryClient } from '@tanstack/react-query';
import { setupMocks } from './mocks/setupMocks';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { PaymentIntentResult } from '@stripe/stripe-js';
import { useStripeClient } from '../Payment/useStripeClient';
import ToggleInput from '../ToggleInput';
import { mockMemberProfileResponse } from './mocks/mockMemberProfileGet';
import Button from '../Button-V2';
import useDrawer from '../Drawer/useDrawer';
import RequestNewCard from '../RequestNewCard';

const RequestNewCardDebug = () => {
  const { open } = useDrawer();
  const [cardWillSucceed, setCardWillSucceed] = useState(true);
  const [freeReprint, setFreeReprint] = useState(false);
  const [overrides, setOverrides] = useState(false);
  const stripeClient = useStripeClient(
    'pk_test_51QACN4S9N5NHrlGYTj7qmy768u9A2lqFqL2AWQbOX3tbJhJO3tjDS74KuBcOwyiz6Dov35tox4aMi97bWX4Z2MCM00boCBdcYs',
  );
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();
  const {
    sequence,
    memberId,
    previousStep,
    currentStep,
    nextStep,
    isCurrentStepComplete,
    verificationMethod,
  } = useRequestNewCard();

  useEffect(() => {
    if (!stripeClient || !overrides) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    stripeClient.confirmPayment = async () => {
      mockMemberProfileResponse.card.paymentStatus = cardWillSucceed
        ? 'PAID_CARD'
        : 'AWAITING_PAYMENT';
      await queryClient.invalidateQueries({ queryKey: ['memberProfile', memberId] });
      if (!cardWillSucceed) return { success: false, error: { message: 'Something went wrong' } };
      return { success: true } as unknown as PaymentIntentResult;
    };
  }, [cardWillSucceed, stripeClient]);

  useEffect(() => {
    if (!overrides) return;
    setupMocks(adapter, freeReprint);
    queryClient.invalidateQueries({ queryKey: ['memberProfile'] });
  }, [freeReprint, overrides]);

  const onToggle = (_: SyntheticEvent, id?: string | undefined) => {
    if (id === 'freeReprint') setFreeReprint(!freeReprint);
    if (id === 'cardWillSucceed') setCardWillSucceed(!cardWillSucceed);
    if (id === 'overrides') setOverrides(!overrides);
  };

  const onBecomeStagingUser = () => {
    localStorage.setItem('username', 'd838d443-662e-4ae0-b2f9-da15a95249a3');
    window.location.reload();
  };

  return (
    <div>
      <Button onClick={onBecomeStagingUser}>Become staging user</Button>
      <Button onClick={() => open(<RequestNewCard />)}>Request new card</Button>
      <label htmlFor={'freeReprint'} className={'flex items-center py-1 gap-2'}>
        <ToggleInput onChange={onToggle} id={'overrides'} selected={overrides} />
        Overrides?
      </label>
      <p>verificationMethod: {verificationMethod}</p>
      <ul>
        {sequence.map((seq, i) => (
          <li
            key={seq}
            className={`${currentStep === i ? colours.textError : colours.textOnSurface}`}
          >
            {seq}
            {previousStep === i ? ' (Previous)' : ''}
            {currentStep === i && isCurrentStepComplete ? ' (Complete)' : ''}
            {nextStep === i ? ' (Next)' : ''}
          </li>
        ))}
      </ul>

      {overrides ? (
        <div>
          <label htmlFor={'freeReprint'} className={'flex items-center py-1 gap-2'}>
            <ToggleInput onChange={onToggle} id={'freeReprint'} selected={freeReprint} />
            Free reprint
          </label>

          <label htmlFor={'cardResult'} className={'flex items-center py-1 gap-2'}>
            <ToggleInput
              onChange={onToggle}
              id={'cardWillSucceed'}
              selected={cardWillSucceed}
              disabled={freeReprint}
            />
            Card will succeed
          </label>
        </div>
      ) : null}
    </div>
  );
};

export default RequestNewCardDebug;
