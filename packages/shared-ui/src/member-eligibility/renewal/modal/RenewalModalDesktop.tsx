import { FC } from 'react';
import { OnClose } from './types/OnClose';
import { getModalImage } from './utils/GetModalImage';
import { usePlatformAdapter } from '../../../adapters';
import { computeValue } from './utils/ComputeValue';
import { colours, fonts } from '../../../tailwind/theme';
import { subTitleStyles } from './utils/SubTitleStyles';
import { useOnClickRenewMembership } from './hooks/useOnClickRenewMembership';
import { renewalEvents } from './amplitude-events/RenewalEvents';
import { ThemeVariant } from '../../../types';
import { StarFrame } from './frames/StarFrame';
import { PhoneFrame } from './frames/PhoneFrame';
import { PresentFrame } from './frames/PresentFrame';
import { HeartFrame } from './frames/HeartFrame';
import { subtitle, title } from './utils/TitleAndSubTitle';
import { EligibilityDesktopModal } from './components/EligibilityDesktopModal';
import Button from '../../../components/Button-V2';

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
      renewalEvents.onClickLater.params,
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
