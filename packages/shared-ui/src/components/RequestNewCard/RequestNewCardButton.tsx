import { ThemeVariant } from '../../types';
import { faCreditCardBlank } from '@fortawesome/pro-solid-svg-icons';
import { ButtonV2 as Button, useDrawer, useMemberProfileGet } from '../../index';
import { FC, SyntheticEvent } from 'react';
import RequestNewCard from './index';
import useMemberApplication from '../../hooks/useMemberApplication';
import { applicationIsComplete } from './util/applicationIsComplete';

const getText = (applicationStarted: boolean, applicationCompleted: boolean) => {
  if (applicationCompleted) return 'Request in progress';
  if (applicationStarted) return 'Continue card request';
  return 'Request new card';
};

interface RequestNewCardButtonProps {
  isTertiary?: boolean;
}

const RequestNewCardButton: FC<RequestNewCardButtonProps> = ({ isTertiary }) => {
  const { open } = useDrawer();
  const { memberProfile } = useMemberProfileGet();
  const { hasApplication, application } = useMemberApplication();

  const onRequestNewCard = (e: SyntheticEvent) => {
    e.preventDefault();
    open(<RequestNewCard />);
  };

  const applicationCompleted = application
    ? applicationIsComplete(application, memberProfile?.county)
    : undefined;
  const variant = hasApplication
    ? ThemeVariant.Primary
    : isTertiary
      ? ThemeVariant.Tertiary
      : ThemeVariant.Secondary;

  const text = getText(!!hasApplication, !!applicationCompleted);
  const className = hasApplication ? 'px-[24px]' : undefined;
  return (
    <Button
      className={className}
      variant={variant}
      iconRight={faCreditCardBlank}
      type="button"
      size={'Large'}
      onClick={onRequestNewCard}
      disabled={applicationCompleted}
    >
      {text}
    </Button>
  );
};

export default RequestNewCardButton;
