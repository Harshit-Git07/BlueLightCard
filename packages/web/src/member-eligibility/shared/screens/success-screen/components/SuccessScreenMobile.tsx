import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import React, { FC } from 'react';
import { AppStoreLinks } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/AppStoreLinks';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { getTitlesAndSubtitles } from '@/root/src/member-eligibility/shared/screens/success-screen/hooks/GetTitlesAndSubtitles';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { successEvents } from '@/root/src/member-eligibility/shared/screens/success-screen/amplitude-events/SuccessEvents';
import { getModalImage } from '@/root/src/member-eligibility/shared/screens/success-screen/components/utils/GetModalImage';
import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';
import { EligibilityMobileModal } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/EligibilityMobileModal';
import { OnClose } from '@/root/src/member-eligibility/shared/screens/success-screen/types/OnClose';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
  onClose?: OnClose;
}

export const SuccessModelMobile: FC<Props> = ({ eligibilityDetailsState, onClose }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();

  const { title, subtitle } = getTitlesAndSubtitles(eligibilityDetailsState);
  const imagePath = getModalImage();

  const titleStyles = computeValue(() => {
    return `${fonts.headlineBold} ${colours.textOnSurface} text-center leading-relaxed`;
  });

  const subTitleStyles = computeValue(() => {
    return `${fonts.body} ${colours.textOnSurface} text-center leading-relaxed`;
  });

  return (
    <EligibilityMobileModal imagePath={imagePath} data-testid="sign-up-success-screen">
      <div className="flex flex-col justify-center align-center gap-[4px]">
        <p className={titleStyles}>{title}</p>

        <p className={subTitleStyles}>{subtitle}</p>
      </div>

      <div className="flex flex-col justify-center align-center gap-[24px]">
        <AppStoreLinks eligibilityDetails={eligibilityDetails} />

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
    </EligibilityMobileModal>
  );
};
