import React, { FC } from 'react';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useRouter } from 'next/router';
import DefaultImage from '@assets/modalPlaceholder.svg';
import { AppStoreLinks } from '@/root/src/member-eligibility/shared/screens/shared/components/modal/AppStoreLinks';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { getTitlesAndSubtitles } from '@/root/src/member-eligibility/shared/screens/success-screen/hooks/GetTitlesAndSubtitles';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const SuccessScreenMobileView: FC<Props> = ({ eligibilityDetailsState }) => {
  const router = useRouter();
  const { title, subtitle } = getTitlesAndSubtitles(eligibilityDetailsState);

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

        <AppStoreLinks className="mt-[24px]" />

        <Button
          className="mt-[24px] mb-[24px] w-full"
          variant={ThemeVariant.Primary}
          size="Large"
          // TODO: We need to figure out if this screen routes us to members-home or should we already be there at this stage and this button just closes the modal?
          onClick={() => router.push('/members-home')}
        >
          Start browsing
        </Button>

        <DefaultImage className="w-full h-full mb-[24px]" />
      </div>
    </EligibilityScreen>
  );
};
