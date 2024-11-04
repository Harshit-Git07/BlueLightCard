import React, { FC } from 'react';
import Header from '../../../shared/components/header/Header';
import MinimalFooter from '@bluelightcard/shared-ui/components/MinimalFooter';
import Typography from '@bluelightcard/shared-ui/components/Typography';
import Card from '@bluelightcard/shared-ui/components/Card';
import { CardState } from '../../CardState';
import MainContainer from '@/root/src/member-eligibility/shared/components/containers/main-container/MainContainer';
import { generateWelcomeMessage } from '@/root/src/member-eligibility/sign-up/components/interstitial-screen/hooks/WelcomeMessageBuilder';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui';

const VERIFY_ELIGIBILITY_TITLE = 'Verify Eligibility';
const VERIFY_ELIGIBILITY_DESCRIPTION =
  'Provide your job details and work email for quick verification or upload an eligible form of ID';
const START_BUTTON = 'Start';
const MAKE_PAYMENT_TITLE = 'Make a payment';
const MAKE_PAYMENT_DESCRIPTION = `Enter your delivery address and unlock two years of exclusive access for just ${
  BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99'
}`;

export const InterstitialScreen: FC = () => {
  const welcomeMessage = generateWelcomeMessage();
  const isMobile = useMobileMediaQuery();

  return (
    <div className="min-h-screen flex flex-col justify-between" data-testid="InterstitialScreen">
      <Header />

      <MainContainer className="px-[18px] pt-8 md:pt-12">
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
            cardTitle={VERIFY_ELIGIBILITY_TITLE}
            description={VERIFY_ELIGIBILITY_DESCRIPTION}
            showButton={true}
            buttonTitle={START_BUTTON}
            initialCardState={CardState.SELECTED}
            className="md:w-[450px]"
          ></Card>

          <Card
            cardTitle={MAKE_PAYMENT_TITLE}
            description={MAKE_PAYMENT_DESCRIPTION}
            initialCardState={CardState.DEFAULT}
            className="mt-4 mb-48 md:w-[450px]"
          ></Card>
        </div>
      </MainContainer>

      <MinimalFooter />
    </div>
  );
};

export default InterstitialScreen;
