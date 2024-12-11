import { FC, SyntheticEvent, useState } from 'react';
import AccountDrawer from '../../AccountDrawer/';
import RadioGroup, { RadioGroupItems } from '../../RadioButton/components/RadioButtonGroup';
import useRequestNewCard from '../useRequestNewCard';
import Alert from '../../Alert';
import {
  drawerTitle,
  outsideReprintPeriod,
  problem,
  withinReprintPeriod,
} from '../requestNewCardConfig';
import IdVerificationTitle from '../IdVerification/components/IdVerificationTitle';
import useMemberCard from '../useMemberCard';

const radioOptions: RadioGroupItems = [
  {
    id: 'not_received',
    label: 'I didn’t received my card yet',
  },
  {
    id: 'lost_card',
    label: 'I lost my card',
  },
  {
    id: 'stolen',
    label: 'My card was stolen',
  },
  {
    id: 'damage',
    label: 'My card is damaged',
  },
];

const RequestNewCardReason: FC = () => {
  const { mutateAsync, isPending, goNext, memberId } = useRequestNewCard();
  const { insideReprintPeriod } = useMemberCard(memberId);

  const [applicationReason, setApplicationReason] = useState<string>('');

  const onReasonChange = (_: SyntheticEvent, id?: string) => {
    setApplicationReason(id as string);
  };

  const onSubmit = async () => {
    await mutateAsync({ applicationReason: insideReprintPeriod ? 'REPRINT' : 'LOST_CARD' });
    goNext();
  };

  return (
    <form onSubmit={onSubmit} className={'h-full'}>
      <AccountDrawer
        title={drawerTitle}
        primaryButtonLabel={'Next'}
        primaryButtonOnClick={onSubmit}
        secondaryButtonLabel={'Save'}
        secondaryButtonOnClick={() => {}}
        isDisabled={applicationReason === '' || isPending}
      >
        <IdVerificationTitle>{problem}</IdVerificationTitle>
        <div className={'pt-2 pb-[24px]'}>
          <RadioGroup
            name={'cardProblem'}
            items={radioOptions}
            onChange={onReasonChange}
            value={applicationReason}
          />
        </div>
        {applicationReason ? (
          <Alert
            variant={'Inline'}
            state={'Info'}
            title={insideReprintPeriod ? withinReprintPeriod : outsideReprintPeriod}
          />
        ) : null}
      </AccountDrawer>
    </form>
  );
};

export default RequestNewCardReason;
