import { FC } from 'react';
import Alert from '../Alert';
import { copy } from './copy';
import ButtonV2 from '../Button-V2';
import { ThemeVariant } from '../../types';

const AwaitingIdApproval: FC = () => (
  <Alert
    title={copy.awaitingIdApproval.title}
    state="Info"
    variant="Banner"
    subtext={copy.awaitingIdApproval.subtext}
    isFullWidth
    isDismissable
  >
    <div className="h-full flex items-center tablet:ml-auto">
      <NeedHelpButton />
    </div>
  </Alert>
);

const zendeskUrl = 'https://support.bluelightcard.co.uk/hc/en-gb/requests/new';

const NeedHelpButton: FC = () => {
  return (
    <ButtonV2 variant={ThemeVariant.Tertiary} href={zendeskUrl} className="!px-0">
      {copy.awaitingIdApproval.buttonText}
    </ButtonV2>
  );
};

export default AwaitingIdApproval;
