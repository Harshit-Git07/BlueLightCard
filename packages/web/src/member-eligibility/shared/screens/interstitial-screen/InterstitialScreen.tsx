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

interface Props extends PropsWithChildren {
  title: InterstitialScreenTitleProps;
  fuzzyFrontEndButtons?: FuzzyFrontendButtonProps[];
  'data-testid'?: string;
}

export const InterstitialScreen: FC<Props> = ({
  title,
  fuzzyFrontEndButtons,
  children,
  ...props
}) => (
  <EligibilityScreen data-testid={props['data-testid']}>
    <main className="flex flex-col flex-grow items-stretch mobile:pb-[96px] md:pb-[64px] mx-auto mobile:min-h-revert md:min-h-fit mobile-xl:w-[500px] mobile:w-full mobile:px-[18px] md:px-0 md:pt-[48px] pt-[32px]">
      <div className="flex flex-col gap-[24px]">
        <InterstitialScreenTitle title={title} />

        <InterstitialSubTitle numberOfStepsAsWord="three" status="continue" />
      </div>

      <div className="flex flex-col self-center gap-[16px]">{children}</div>

      {fuzzyFrontEndButtons && (
        <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
      )}
    </main>
  </EligibilityScreen>
);
