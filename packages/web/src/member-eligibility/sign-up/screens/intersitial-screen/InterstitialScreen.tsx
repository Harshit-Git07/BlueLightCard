import React, { FC, useMemo } from 'react';
import Typography from '@bluelightcard/shared-ui/components/Typography';
import Card from '@bluelightcard/shared-ui/components/Card';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';
import { generateWelcomeMessage } from '@/root/src/member-eligibility/sign-up/screens/intersitial-screen/hooks/WelcomeMessageBuilder';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';

export const InterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const welcomeMessage = generateWelcomeMessage();

  const isMobile = useMobileMediaQuery();

  const paymentCardDescription = useMemo(() => {
    return `Enter your delivery address and unlock two years of exclusive access for just ${
      BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99'
    }`;
  }, []);

  return (
    <EligibilityScreen data-testid="InterstitialScreen">
      <EligibilityBody className="px-[18px] pt-8 md:pt-12">
        <div className="px-[18px] flex flex-col items-center justify-center">
          <Typography
            variant={isMobile ? 'headline' : 'display-small-text'}
            className="text-center md:text-nowrap"
          >
            {welcomeMessage.line1}
          </Typography>

          <Typography
            variant={isMobile ? 'headline' : 'display-small-text'}
            className="text-center md:text-nowrap"
          >
            <span className="bg-gradient-to-b from-colour-secondary-gradient-bright-fixed to-colour-secondary-gradient-centre-fixed bg-clip-text text-transparent">
              {welcomeMessage.line2}
            </span>

            {welcomeMessage.line3}
          </Typography>

          <Typography
            variant={isMobile ? 'title-medium' : 'title-large'}
            className="text-center mt-4 mb-6 text-nowrap"
          >
            You have two steps to complete <br />
            before you can start saving
          </Typography>

          <Card
            data-testid="verify-eligibility-card"
            cardTitle="Verify Eligibility"
            description="Provide your job details and work email for quick verification or upload an eligible form of ID"
            showButton={true}
            buttonTitle="Start"
            onClick={() => {
              setEligibilityDetails({
                ...eligibilityDetails,
                currentScreen: 'Employment Status Screen',
              });
            }}
            initialCardState="selected"
            className="md:w-[450px]"
          />

          <Card
            cardTitle="Make a payment"
            description={paymentCardDescription}
            initialCardState="default"
            className="mt-4 mb-48 md:w-[450px]"
          />
        </div>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
