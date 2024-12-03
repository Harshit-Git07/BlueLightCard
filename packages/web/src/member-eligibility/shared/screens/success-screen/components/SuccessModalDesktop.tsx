import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useRouter } from 'next/router';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import React, { FC, useMemo } from 'react';
import { EligibilityModalBody } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/EligibilityModalBody';
import { AppStoreQrCode } from '@/components/AppStoreQrCode/AppStoreQrCode';
import { AppStoreLinks } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/AppStoreLinks';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { getTitlesAndSubtitles } from '@/root/src/member-eligibility/shared/screens/success-screen/hooks/GetTitlesAndSubtitles';
import { useMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { successEvents } from '@/root/src/member-eligibility/shared/screens/success-screen/amplitude-events/SuccessEvents';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const SuccessModalDesktop: FC<Props> = ({ eligibilityDetailsState }) => {
  const router = useRouter();
  const brandName = BRAND === BRANDS.DDS_UK ? 'Defence Discount' : 'Blue Light';
  const { title, subtitle } = getTitlesAndSubtitles(eligibilityDetailsState);
  const [eligibilityDetails] = eligibilityDetailsState;
  const isPadPro = useMediaQuery(
    '(min-width: 1024px) and (max-width: 1024px) and (orientation: portrait)'
  );
  const logAnalyticsEvent = useLogAmplitudeEvent();
  const ipadProStyles = useMemo(() => {
    if (!isPadPro) return 'md:mb-[30px] lg:mb-[60px]';

    return 'mb-[30px]';
  }, [isPadPro]);

  return (
    <EligibilityModalBody data-testid="sign-up-success-screen">
      <p
        className={`${fonts.displaySmallText} ${colours.textOnSurface} mx-[50px] mb-[4px] lg:mt-[78px] md:portrait:mt-[0px] truncate`}
      >
        {title}
      </p>

      <p className={`${fonts.body} ${colours.textOnSurface} mb-[24px] text-center leading-relaxed`}>
        {subtitle}
      </p>

      <Button
        className={`${ipadProStyles} w-4/5`}
        variant={ThemeVariant.Primary}
        size="Large"
        // TODO: We need to figure out if this screen routes us to members-home or should we already be there at this stage and this button just closes the modal?
        onClick={() => {
          logAnalyticsEvent(successEvents.onStartBrowsingClicked(eligibilityDetails));
          router.push('/members-home');
        }}
      >
        Start browsing
      </Button>

      <p
        className={`${fonts.headlineSmallBold} ${colours.textOnSurface} mb-[16px] text-center leading-relaxed`}
      >
        Get the {brandName} <br /> Card App
      </p>

      <AppStoreQrCode className="h-full" />

      <AppStoreLinks eligibilityDetails={eligibilityDetails} className="mt-[44px] mb-[78px]" />
    </EligibilityModalBody>
  );
};
