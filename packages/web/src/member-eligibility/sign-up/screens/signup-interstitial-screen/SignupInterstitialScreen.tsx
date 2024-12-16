import React, { FC, useMemo } from 'react';
import Card from '@bluelightcard/shared-ui/components/Card';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { buildSignupTitle } from '@/root/src/member-eligibility/sign-up/screens/signup-interstitial-screen/hooks/SignupTitleBuilder';
import { InterstitialScreen } from '@/root/src/member-eligibility/shared/screens/interstitial-screen/InterstitialScreen';
import {
  interstitialCardWithButton,
  interstitialCardWithoutButton,
} from '@/root/src/member-eligibility/shared/screens/interstitial-screen/constants/CardProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { interstitialEvents } from '@/root/src/member-eligibility/sign-up/screens/signup-interstitial-screen/amplitude-events/InterstitialEvents';

export const SignupInterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

  const title = buildSignupTitle();

  const paymentCardDescription = useMemo(() => {
    const cost = BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99';

    return `Enter your delivery address and unlock two years of exclusive access for just ${cost}.`;
  }, []);

  const makeAPaymentCardHasButton = useMemo(() => {
    if (eligibilityDetails.emailVerification) return true;

    return eligibilityDetails.fileVerification && eligibilityDetails.fileVerification.length > 0;
  }, [eligibilityDetails.emailVerification, eligibilityDetails.fileVerification]);

  const showVerifyEligibilityCard = useMemo(() => {
    return !makeAPaymentCardHasButton;
  }, [makeAPaymentCardHasButton]);

  const skipToPaymentCardProps = useMemo(() => {
    return makeAPaymentCardHasButton ? interstitialCardWithButton : interstitialCardWithoutButton;
  }, [makeAPaymentCardHasButton]);

  return (
    <InterstitialScreen
      title={title}
      eligibilityDetails={eligibilityDetails}
      data-testid="signup-interstitial-screen"
    >
      {showVerifyEligibilityCard && (
        <Card
          data-testid="verify-eligibility-card"
          cardTitle="Verify Eligibility"
          description="Provide your job details and work email for quick verification or upload an eligible form of ID"
          onClick={() => {
            logAnalyticsEvent(interstitialEvents.onFlowStarted(eligibilityDetails));

            setEligibilityDetails({
              ...eligibilityDetails,
              currentScreen: 'Employment Status Screen',
            });
          }}
          {...interstitialCardWithButton}
        />
      )}

      <Card
        data-testid="skip-to-payment-card"
        cardTitle="Make a payment"
        description={paymentCardDescription}
        onClick={() => {
          logAnalyticsEvent(interstitialEvents.onSkipToPayment(eligibilityDetails));

          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Delivery Address Screen',
            hasJumpedStraightToPayment: true,
          });
        }}
        {...skipToPaymentCardProps}
      />
    </InterstitialScreen>
  );
};
