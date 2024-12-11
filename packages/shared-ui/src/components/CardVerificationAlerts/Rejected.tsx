import { FC } from 'react';
import Alert from '../Alert';
import { copy } from './copy';
import { RejectionReasonSchema } from './types';
import { ButtonV2, ThemeVariant } from '../../index';

type Props = { reason: RejectionReasonSchema };
const Rejected: FC<Props> = ({ reason }) => {
  const subtextCopy = reason ? copy.rejected.subtext[reason] : '';

  return (
    <Alert
      title={copy.rejected.title}
      state="Warning"
      variant="Banner"
      subtext={subtextCopy}
      isFullWidth
    >
      <div className="h-full flex items-center tablet:ml-auto">
        <VerifyYourEligibilityButton />
      </div>
    </Alert>
  );
};

const verifyEligibilityUrl = '/eligibility';

const VerifyYourEligibilityButton: FC = () => {
  return (
    <ButtonV2 variant={ThemeVariant.Primary} href={verifyEligibilityUrl}>
      {copy.rejected.buttonText}
    </ButtonV2>
  );
};

export default Rejected;
