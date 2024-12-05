import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import Card from '@bluelightcard/shared-ui/components/Card';
import { buildRenewalTitle } from '@/root/src/member-eligibility/renewal/screens/renewal-interstitial-screen/hooks/RenewalTitleBuilder';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/renewal/screens/renewal-interstitial-screen/hooks/UseFuzzyFrontendButtons';
import { InterstitialScreen } from '@/root/src/member-eligibility/shared/screens/interstitial-screen/InterstitialScreen';
import {
  interstitialCardWithButton,
  interstitialCardWithoutButton,
} from '@/root/src/member-eligibility/shared/screens/interstitial-screen/constants/CardProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { interstitialEvents } from '@/root/src/member-eligibility/sign-up/screens/signup-interstitial-screen/amplitude-events/InterstitialEvents';

export const RenewalInterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  useLogAnalyticsPageView(eligibilityDetails);
  const logAnalyticsEvent = useLogAmplitudeEvent();

  const title = buildRenewalTitle();

  const paymentCardDescription = useMemo(() => {
    const price = BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99';

    return `Secure your exclusive membership for just ${price}. Enjoy another two years of savings and special offers.`;
  }, []);

  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  const makeAPaymentCardHasButton = useMemo(() => {
    if (eligibilityDetails.emailVerification) return true;

    return eligibilityDetails.fileVerification && eligibilityDetails.fileVerification.length > 0;
  }, [eligibilityDetails.emailVerification, eligibilityDetails.fileVerification]);

  const reviewEmploymentDetailsCardHasButton = useMemo(() => {
    if (makeAPaymentCardHasButton) return false;

    return eligibilityDetails.address;
  }, [eligibilityDetails.address, makeAPaymentCardHasButton]);

  const showReviewEmploymentDetailsCard = useMemo(() => {
    return !makeAPaymentCardHasButton;
  }, [makeAPaymentCardHasButton]);

  const showReviewAccountDetailsCard = useMemo(() => {
    return !makeAPaymentCardHasButton && !reviewEmploymentDetailsCardHasButton;
  }, [makeAPaymentCardHasButton, reviewEmploymentDetailsCardHasButton]);

  const skipToEmploymentCardProps = useMemo(() => {
    return reviewEmploymentDetailsCardHasButton
      ? interstitialCardWithButton
      : interstitialCardWithoutButton;
  }, [reviewEmploymentDetailsCardHasButton]);

  const skipToPaymentCardProps = useMemo(() => {
    return makeAPaymentCardHasButton ? interstitialCardWithButton : interstitialCardWithoutButton;
  }, [makeAPaymentCardHasButton]);

  return (
    <InterstitialScreen
      title={title}
      eligibilityDetails={eligibilityDetails}
      fuzzyFrontEndButtons={fuzzyFrontEndButtons}
      data-testid="Renewal Intersititial Screen"
    >
      {showReviewAccountDetailsCard && (
        <Card
          data-testid="review-account-details-card"
          cardTitle="Review Account Details"
          description="Make sure your information is up to date and matches your ID and tell us where to send your new card."
          onClick={() => {
            logAnalyticsEvent(interstitialEvents.onFlowStarted(eligibilityDetails));

            setEligibilityDetails({
              ...eligibilityDetails,
              currentScreen: 'Renewal Account Details Screen',
            });
          }}
          {...interstitialCardWithButton}
        />
      )}

      {showReviewEmploymentDetailsCard && (
        <Card
          cardTitle="Review Employment Details"
          description="Provide your job details and work email for quick verification, or upload an eligible form of ID."
          onClick={() => {
            logAnalyticsEvent(interstitialEvents.onSkipToJobDetails(eligibilityDetails));

            setEligibilityDetails({
              ...eligibilityDetails,
              currentScreen: 'Job Details Screen',
            });
          }}
          {...skipToEmploymentCardProps}
        />
      )}

      <Card
        cardTitle="Make a Payment"
        description={paymentCardDescription}
        onClick={() => {
          logAnalyticsEvent(interstitialEvents.onSkipToPayment(eligibilityDetails));

          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
          });
        }}
        {...skipToPaymentCardProps}
      />
    </InterstitialScreen>
  );
};
