import React, { FC, useMemo } from 'react';
import Card from '@bluelightcard/shared-ui/components/Card';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { generateWelcomeMessage } from '@/root/src/member-eligibility/sign-up/screens/signup-interstitial-screen/hooks/WelcomeMessageBuilder';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';

export const SignupInterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const welcomeMessage = generateWelcomeMessage();

  const isMobile = useMobileMediaQuery();

  const welcomeMessageStyles = useMemo(() => {
    const font = isMobile ? fonts.headline : fonts.displaySmallText;

    return `text-center md:text-nowrap ${font}`;
  }, [isMobile]);

  const subtitleStyles = useMemo(() => {
    const font = isMobile ? fonts.titleMedium : fonts.titleLarge;

    return `text-center mt-4 mb-6 text-nowrap ${font}`;
  }, [isMobile]);

  const paymentCardDescription = useMemo(() => {
    return `Enter your delivery address and unlock two years of exclusive access for just ${
      BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99'
    }`;
  }, []);

  return (
    <EligibilityScreen data-testid="SignupInterstitialScreen">
      <EligibilityBody>
        <div className={welcomeMessageStyles}>{welcomeMessage.line1}</div>

        <div className={welcomeMessageStyles}>
          <span className="bg-gradient-to-b from-colour-secondary-gradient-bright-fixed to-colour-secondary-gradient-centre-fixed bg-clip-text text-transparent">
            {welcomeMessage.line2}
          </span>

          {welcomeMessage.line3}
        </div>

        <div className={subtitleStyles}>
          You have two steps to complete
          <br />
          before you can start saving
        </div>

        <div className="flex flex-col self-center md:w-[450px] sm:w-[400px] gap-[24px]">
          <Card
            data-testid="verify-eligibility-card"
            cardTitle="Verify Eligibility"
            description="Provide your job details and work email for quick verification or upload an eligible form of ID"
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
        </div>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
