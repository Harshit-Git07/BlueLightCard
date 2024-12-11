import { FC } from 'react';
import Alert from '../Alert';
import { copy } from './copy';
import ButtonV2 from '../Button-V2';
import { ThemeVariant } from '../../types';
import { brand } from '../../utils/brand';

type Props = {
  eligibilityStatus?: string;
};

const AwaitingId: FC<Props> = ({ eligibilityStatus }) => {
  const brandTitle = brand === 'dds-uk' ? 'Defence Discount Service Card' : 'Blue Light Card';
  const cardDuration = brand === 'dds-uk' ? '5 years' : '2 years';
  return (
    <Alert
      title={copy.awaitingId.title.replace('{brandTitle}', brandTitle)}
      state="Warning"
      variant="Banner"
      subtext={copy.awaitingId.subtext.replace('{cardDuration}', cardDuration)}
      isFullWidth
    >
      <div className="h-full flex items-center tablet:ml-auto">
        <GetYourCardButton eligibilityStatus={eligibilityStatus} />
      </div>
    </Alert>
  );
};

const verifyEligibilityUrl = '/eligibility';

const GetYourCardButton: FC<Props> = ({ eligibilityStatus }) => {
  return (
    <ButtonV2 variant={ThemeVariant.Primary} href={verifyEligibilityUrl}>
      {eligibilityStatus === 'AWAITING_PAYMENT'
        ? copy.awaitingId.buttonText.awaitingPayment
        : copy.awaitingId.buttonText.awaitingId}
    </ButtonV2>
  );
};

export default AwaitingId;
