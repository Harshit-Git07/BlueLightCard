import React, { FC, PropsWithChildren } from 'react';
import {
  FuzzyFrontendButtonProps,
  FuzzyFrontendButtons,
} from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import {
  InterstitialScreenTitle,
  InterstitialScreenTitleProps,
} from '@/root/src/member-eligibility/shared/screens/interstitial-screen/components/interstitial-screen-title/InterstitialScreenTitle';
import { InterstitialSubTitle } from '@/root/src/member-eligibility/shared/screens/interstitial-screen/components/interstitial-sub-title/InterstitialSubTitle';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

interface Props extends PropsWithChildren {
  title: InterstitialScreenTitleProps;
  eligibilityDetails: EligibilityDetails;
  fuzzyFrontEndButtons?: FuzzyFrontendButtonProps[];
  'data-testid'?: string;
}

export const InterstitialScreen: FC<Props> = ({
  title,
  eligibilityDetails,
  fuzzyFrontEndButtons,
  children,
  ...props
}) => (
  <EligibilityScreen data-testid={props['data-testid']}>
    <main className="flex flex-col flex-grow items-stretch gap-[32px] mobile:pb-[96px] md:pb-[64px] mx-auto mobile:min-h-revert md:min-h-fit mobile-xl:w-[500px] mobile:w-full mobile:px-[18px] md:px-0 md:pt-[48px] pt-[32px]">
      <div className="flex flex-col gap-[24px]">
        <InterstitialScreenTitle title={title} />

        <InterstitialSubTitle eligibilityDetails={eligibilityDetails} />
      </div>

      <div className="flex flex-col self-center gap-[16px]">{children}</div>

      {fuzzyFrontEndButtons && (
        <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
      )}
    </main>
  </EligibilityScreen>
);
