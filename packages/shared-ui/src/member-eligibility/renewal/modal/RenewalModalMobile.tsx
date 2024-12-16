import React, { FC } from 'react';
import { HeartFrame } from './frames/HeartFrame';
import { PresentFrame } from './frames/PresentFrame';
import { PhoneFrame } from './frames/PhoneFrame';
import { StarFrame } from './frames/StarFrame';
import { subTitleStyles } from './utils/SubTitleStyles';
import { useOnClickRenewMembership } from './hooks/useOnClickRenewMembership';
import { title, subtitle } from './utils/TitleAndSubTitle';
import { renewalEvents } from './amplitude-events/RenewalEvents';
import { ThemeVariant } from '../../../types';
import { usePlatformAdapter } from '../../../adapters';
import { colours, fonts } from '../../../tailwind/theme';
import Button from '../../../components/Button-V2';
import { OnClose } from './types/OnClose';
import { getModalImage } from './utils/GetModalImage';
import { computeValue } from './utils/ComputeValue';
import { EligibilityMobileModal } from './components/EligibilityMobileModal';

interface Props {
  onClose?: OnClose;
  ifCardExpiredMoreThan30Days?: boolean;
}

export const RenewalModalMobile: FC<Props> = ({ onClose, ifCardExpiredMoreThan30Days }) => {
  const imagePath = getModalImage();
  const platformAdapter = usePlatformAdapter();

  const titleStyles = computeValue(() => {
    return `${fonts.headlineBold} ${colours.textOnSurface} text-center leading-relaxed`;
  });

  const subTitleStyle = subTitleStyles();

  const onClickRenewMembership = useOnClickRenewMembership();

  const onClickLater = () => {
    platformAdapter.logAnalyticsEvent(
      renewalEvents.onClickLater.event,
      renewalEvents.onClickLater.params,
    );
    onClose?.();
  };

  return (
    <EligibilityMobileModal imagePath={imagePath} data-testid="sign-up-success-screen">
      <div className="flex flex-col justify-center align-center gap-[4px]">
        <p className={titleStyles}>{title}</p>

        <p className={subTitleStyle}>{subtitle}</p>
      </div>

      <div className="flex flex-col justify-center align-center gap-[8px]">
        <HeartFrame isMobile />

        <PresentFrame isMobile />

        <PhoneFrame isMobile />

        <StarFrame isMobile />

        <div className="flex w-full gap-[8px]">
          {!ifCardExpiredMoreThan30Days && (
            <Button
              data-testid="delay-renewal-button-mobile"
              variant={ThemeVariant.Secondary}
              onClick={onClickLater}
              className="w-1/5"
              size="Large"
            >
              Later
            </Button>
          )}

          <Button
            data-testid="renewal-button-mobile"
            className={!ifCardExpiredMoreThan30Days ? 'w-4/5 ml-auto' : 'w-full'}
            onClick={onClickRenewMembership}
            size="Large"
          >
            Renew membership
          </Button>
        </div>
      </div>
    </EligibilityMobileModal>
  );
};
