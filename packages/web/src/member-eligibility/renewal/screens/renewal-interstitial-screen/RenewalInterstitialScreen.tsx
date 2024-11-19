import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import Card from '@bluelightcard/shared-ui/components/Card';
import { buildRenewalTitle } from '@/root/src/member-eligibility/renewal/screens/renewal-interstitial-screen/hooks/RenewalTitleBuilder';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/renewal/screens/renewal-interstitial-screen/hooks/UseFuzzyFrontendButtons';
import { InterstitialSubTitle } from '@/root/src/member-eligibility/shared/screens/shared/interstitial/interstitial-sub-title/InterstitialSubTitle';
import { InterstitialScreenTitle } from '@/root/src/member-eligibility/shared/screens/shared/interstitial/interstitial-screen-title/InterstitialScreenTitle';
import { InterstitialScreenCardContainer } from '@/root/src/member-eligibility/shared/screens/shared/interstitial/interstitial-screen-card-container/InterstitialScreenCardContainer';

export const RenewalInterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const title = buildRenewalTitle();

  const paymentCardDescription = useMemo(() => {
    const price = BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99';

    return `Secure your exclusive membership for just ${price}. Enjoy another two years of savings and special offers.`;
  }, []);

  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  return (
    <EligibilityScreen data-testid="Renewal Intersititial Screen">
      <EligibilityBody>
        <InterstitialScreenTitle title={title} />

        <InterstitialSubTitle numberOfStepsAsWord="three" status="continue" />

        <InterstitialScreenCardContainer>
          <Card
            data-testid="review-account-details-card"
            cardTitle="Review Account Details"
            description="Make sure your information is up to date and matches your ID and tell us where to send your new card."
            buttonTitle="Start"
            initialCardState="selected"
            showButton
            onClick={() => {
              setEligibilityDetails({
                ...eligibilityDetails,
                currentScreen: 'Renewal Account Details Screen',
              });
            }}
          />

          <Card
            cardTitle="Review Employment Details"
            description="Provide your job details and work email for quick verification, or upload an eligible form of ID."
            initialCardState="default"
            canHover={false}
          />

          <Card
            cardTitle="Make a Payment"
            description={paymentCardDescription}
            initialCardState="default"
            canHover={false}
          />
        </InterstitialScreenCardContainer>
      </EligibilityBody>

      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
