import { FC } from 'react';
import { OnClose } from '@/root/src/member-eligibility/renewal/modal/types/OnClose';
import { getModalImage } from '@/root/src/member-eligibility/renewal/modal/utils/GetModalImage';
import { subTitleStyles } from '@/root/src/member-eligibility/renewal/modal/utils/SubTitleStyles';
import { useOnClickRenewMembership } from '@/root/src/member-eligibility/renewal/modal/hooks/useOnClickRenewMembership';
import { renewalEvents } from '@/root/src/member-eligibility/renewal/modal/amplitude-events/RenewalEvents';
import { StarFrame } from '@/root/src/member-eligibility/renewal/modal/frames/StarFrame';
import { PhoneFrame } from '@/root/src/member-eligibility/renewal/modal/frames/PhoneFrame';
import { PresentFrame } from '@/root/src/member-eligibility/renewal/modal/frames/PresentFrame';
import { HeartFrame } from '@/root/src/member-eligibility/renewal/modal/frames/HeartFrame';
import {
  subtitle,
  title,
} from '@/root/src/member-eligibility/renewal/modal/utils/TitleAndSubTitle';
import { EligibilityDesktopModal } from '@/root/src/member-eligibility/renewal/modal/components/EligibilityDesktopModal';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';

interface Props {
  onClose?: OnClose;
  ifCardExpiredMoreThan30Days?: boolean;
}

export const RenewalModalDesktop: FC<Props> = ({ onClose, ifCardExpiredMoreThan30Days }) => {
  const imagePath = getModalImage();
  const platformAdapter = usePlatformAdapter();

  const titleStyles = computeValue(() => {
    return `${fonts.displaySmallText} ${colours.textOnSurface} wrap text-center leading-relaxed`;
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
    <EligibilityDesktopModal imagePath={imagePath} data-testid="renewal-modal">
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col justify-center align-center gap-[24px]">
          <div className="flex flex-col justify-center align-center gap-[4px]">
            <p className={titleStyles}>{title}</p>

            <p className={subTitleStyle}>{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-col gap-[48px]">
          <div className="flex flex-wrap items-center justify-center gap-[8px]">
            <div className="flex flex-row gap-[8px]">
              <HeartFrame />

              <PresentFrame />
            </div>

            <div className="flex flex-row gap-[8px]">
              <PhoneFrame />

              <StarFrame />
            </div>
          </div>

          <div className="flex w-full max-w-[1200px] mx-auto gap-[8px]">
            {!ifCardExpiredMoreThan30Days && (
              <Button
                data-testid="delay-renewal-button"
                variant={ThemeVariant.Secondary}
                onClick={onClickLater}
                className="w-1/5"
                size="Large"
              >
                Later
              </Button>
            )}

            <Button
              data-testid="renewal-button"
              className={!ifCardExpiredMoreThan30Days ? 'w-4/5 ml-auto' : 'w-full'}
              onClick={onClickRenewMembership}
              size="Large"
            >
              Renew membership
            </Button>
          </div>
        </div>
      </div>
    </EligibilityDesktopModal>
  );
};
