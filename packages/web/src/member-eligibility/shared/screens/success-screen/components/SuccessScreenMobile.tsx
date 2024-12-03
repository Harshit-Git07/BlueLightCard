import React, { FC, SVGProps } from 'react';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useRouter } from 'next/router';
import { AppStoreLinks } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/AppStoreLinks';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { getTitlesAndSubtitles } from '@/root/src/member-eligibility/shared/screens/success-screen/hooks/GetTitlesAndSubtitles';
import { getModalImage } from '@/root/src/member-eligibility/shared/screens/success-screen/utils/GetModalImage';
import { successEvents } from '@/root/src/member-eligibility/shared/screens/success-screen/amplitude-events/SuccessEvents';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const SuccessScreenMobileView: FC<Props> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;
  const router = useRouter();
  const { title, subtitle } = getTitlesAndSubtitles(eligibilityDetailsState);
  const Image = getModalImage();
  const logAnalyticsEvent = useLogAmplitudeEvent();

  //Changing the dimensions of the image based on the screen size
  const imageProps: SVGProps<SVGSVGElement> = {
    viewBox: '50 600 900 500',
  };

  return (
    <EligibilityScreen data-testid="success-screen-mobile">
      <div className="mx-[18px]">
        <p
          className={`${fonts.headlineBold} ${colours.textOnSurface} mt-[32px] text-center leading-relaxed`}
        >
          {title}
        </p>

        <p
          className={`${fonts.body} ${colours.textOnSurface} mt-[4px] text-center leading-relaxed`}
        >
          {subtitle}
        </p>

        <AppStoreLinks eligibilityDetails={eligibilityDetails} className="mt-[24px]" />

        <Button
          className="mt-[24px] mb-[24px] w-full"
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

        <Image
          alt="Example of physical card"
          className="w-full h-full object-center object-cover mb-[24px] rounded-3xl"
          {...imageProps}
        />
      </div>
    </EligibilityScreen>
  );
};
