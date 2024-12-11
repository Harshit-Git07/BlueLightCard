import { ThemeVariant } from '../../types';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import { ButtonV2 as Button, useDrawer } from '../../index';
import React, { SyntheticEvent } from 'react';
import RequestNewCard from './index';
import useMemberId from '../../hooks/useMemberId';
import useMemberApplication from './useMemberApplication';

const RequestNewCardButton = () => {
  const { open } = useDrawer();
  const memberId = useMemberId();
  const { hasApplication } = useMemberApplication(memberId);

  const onRequestNewCard = (e: SyntheticEvent) => {
    e.preventDefault();
    open(<RequestNewCard />);
  };

  if (hasApplication) return <Button onClick={onRequestNewCard}>Continue card request</Button>;

  return (
    <Button
      className="hidden tablet-xl:block"
      variant={ThemeVariant.Tertiary}
      iconRight={faCreditCardBlank}
      type="button"
      size="Large"
      onClick={onRequestNewCard}
    >
      Request new card
    </Button>
  );
};

export default RequestNewCardButton;
