import React, { FC, useMemo } from 'react';
import Card from '@bluelightcard/shared-ui/components/Card';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { buildSignupTitle } from '@/root/src/member-eligibility/sign-up/screens/signup-interstitial-screen/hooks/SignupTitleBuilder';
import { InterstitialSubTitle } from '@/root/src/member-eligibility/shared/screens/shared/interstitial/interstitial-sub-title/InterstitialSubTitle';
import { InterstitialScreenTitle } from '@/root/src/member-eligibility/shared/screens/shared/interstitial/interstitial-screen-title/InterstitialScreenTitle';
import { InterstitialScreenCardContainer } from '@/root/src/member-eligibility/shared/screens/shared/interstitial/interstitial-screen-card-container/InterstitialScreenCardContainer';

export const SignupInterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const title = buildSignupTitle();

  const paymentCardDescription = useMemo(() => {
    const cost = BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99';

    return `Enter your delivery address and unlock two years of exclusive access for just ${cost}.`;
  }, []);

  return (
    <EligibilityScreen data-testid="SignupInterstitialScreen">
      <EligibilityBody>
        <InterstitialScreenTitle title={title} />

        <InterstitialSubTitle numberOfStepsAsWord="two" status="start" />

        <InterstitialScreenCardContainer>
          <Card
            data-testid="verify-eligibility-card"
            cardTitle="Verify Eligibility"
            description="Provide your job details and work email for quick verification or upload an eligible form of ID"
            truncateDescription={false}
            buttonTitle="Start"
            initialCardState="selected"
            showButton
            onClick={() => {
              setEligibilityDetails({
                ...eligibilityDetails,
                currentScreen: 'Employment Status Screen',
              });
            }}
          />

          <Card
            cardTitle="Make a payment"
            description={paymentCardDescription}
            initialCardState="default"
            canHover={false}
          />
        </InterstitialScreenCardContainer>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
