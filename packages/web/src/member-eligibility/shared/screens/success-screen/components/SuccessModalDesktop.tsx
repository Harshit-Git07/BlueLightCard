import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import React, { FC } from 'react';
import { EligibilityDesktopModal } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/EligibilityDesktopModal';
import { AppStoreQrCode } from '@/components/AppStoreQrCode/AppStoreQrCode';
import { AppStoreLinks } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/AppStoreLinks';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { getTitlesAndSubtitles } from '@/root/src/member-eligibility/shared/screens/success-screen/hooks/GetTitlesAndSubtitles';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { successEvents } from '@/root/src/member-eligibility/shared/screens/success-screen/amplitude-events/SuccessEvents';
import { getModalImage } from '@/root/src/member-eligibility/shared/screens/success-screen/components/utils/GetModalImage';
import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';
import { OnClose } from '@/root/src/member-eligibility/shared/screens/success-screen/types/OnClose';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
  onClose?: OnClose;
}

export const SuccessModalDesktop: FC<Props> = ({ eligibilityDetailsState, onClose }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();

  const { title, subtitle } = getTitlesAndSubtitles(eligibilityDetailsState);
  const imagePath = getModalImage();

  const brandName = computeValue(() => {
    return BRAND === BRANDS.DDS_UK ? 'Defence Discount' : 'Blue Light';
  });

  const titleStyles = computeValue(() => {
    return `${fonts.displaySmallText} ${colours.textOnSurface} truncate text-center leading-relaxed`;
  });

  const subTitleStyles = computeValue(() => {
    return `${fonts.body} ${colours.textOnSurface} text-center leading-relaxed`;
  });

  return (
    <EligibilityDesktopModal imagePath={imagePath} data-testid="sign-up-success-screen">
      <div className="flex flex-col justify-center align-center gap-[24px]">
        <div className="flex flex-col justify-center align-center gap-[4px]">
          <p className={titleStyles}>{title}</p>

          <p className={subTitleStyles}>{subtitle}</p>
        </div>

        <Button
          className="w-full"
          variant={ThemeVariant.Primary}
          size="Large"
          onClick={() => {
            logAnalyticsEvent(successEvents.onStartBrowsingClicked(eligibilityDetails));
            onClose?.();
          }}
        >
          Start browsing
        </Button>
      </div>

      <div className="flex flex-col justify-center align-center gap-[40px]">
        <div className="flex flex-col justify-center align-center gap-[16px]">
          <p
            className={`${fonts.headlineSmallBold} ${colours.textOnSurface} text-center leading-relaxed`}
          >
            Get the {brandName} <br /> Card App
          </p>

          <AppStoreQrCode className="self-center" />
        </div>

        <AppStoreLinks eligibilityDetails={eligibilityDetails} />
      </div>
    </EligibilityDesktopModal>
  );
};
