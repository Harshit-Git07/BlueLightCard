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
import useMemberCard from '../../../hooks/useMemberCard';
import { ReorderCardReason } from '../../../api/types';
import useDrawer from '../../../components/Drawer/useDrawer';

export const radioOptions: RadioGroupItems = [
  {
    id: ReorderCardReason.CARD_NOT_RECEIVED_YET,
    label: 'I haven’t received my card yet',
  },
  {
    id: ReorderCardReason.LOST_CARD,
    label: 'I lost my card',
  },
  {
    id: ReorderCardReason.STOLEN_CARD,
    label: 'My card was stolen',
  },
  {
    id: ReorderCardReason.DAMAGED_CARD,
    label: 'My card is damaged',
  },
];

const RequestNewCardReason: FC = () => {
  const { mutateAsync, isPending, goNext, memberId } = useRequestNewCard();
  const { insideReprintPeriod } = useMemberCard(memberId);

  const { close } = useDrawer();

  const [applicationReason, setApplicationReason] = useState<ReorderCardReason | undefined>(
    undefined,
  );

  const onReasonChange = (_: SyntheticEvent, id?: string) => {
    setApplicationReason(id as ReorderCardReason);
  };

  const onSubmit = async () => {
    await mutateAsync({
      applicationReason: insideReprintPeriod ? 'REPRINT' : 'LOST_CARD',
      reorderCardReason: applicationReason,
    });
    goNext();
  };

  const onSave = async () => {
    await mutateAsync({
      applicationReason: insideReprintPeriod ? 'REPRINT' : 'LOST_CARD',
      reorderCardReason: applicationReason,
    });

    close();
  };

  return (
    <form onSubmit={onSubmit} className={'h-full'} name={drawerTitle}>
      <AccountDrawer
        title={drawerTitle}
        primaryButtonLabel={'Next'}
        primaryButtonOnClick={onSubmit}
        secondaryButtonLabel={'Save'}
        secondaryButtonOnClick={onSave}
        isSecondaryButtonDisabled={!applicationReason || isPending}
        isDisabled={!applicationReason || isPending}
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
