import React, { FC } from 'react';
import { HeartFrame } from '@/root/src/member-eligibility/renewal/modal/frames/HeartFrame';
import { PresentFrame } from '@/root/src/member-eligibility/renewal/modal/frames/PresentFrame';
import { PhoneFrame } from '@/root/src/member-eligibility/renewal/modal/frames/PhoneFrame';
import { StarFrame } from '@/root/src/member-eligibility/renewal/modal/frames/StarFrame';
import { subTitleStyles } from '@/root/src/member-eligibility/renewal/modal/utils/SubTitleStyles';
import { useOnClickRenewMembership } from '@/root/src/member-eligibility/renewal/modal/hooks/useOnClickRenewMembership';
import {
  title,
  subtitle,
} from '@/root/src/member-eligibility/renewal/modal/utils/TitleAndSubTitle';
import { renewalEvents } from '@/root/src/member-eligibility/renewal/modal/amplitude-events/RenewalEvents';
import { OnClose } from '@/root/src/member-eligibility/renewal/modal/types/OnClose';
import { getModalImage } from '@/root/src/member-eligibility/renewal/modal/utils/GetModalImage';
import { EligibilityMobileModal } from '@/root/src/member-eligibility/renewal/modal/components/EligibilityMobileModal';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';

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
      renewalEvents.onClickLater.params
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
