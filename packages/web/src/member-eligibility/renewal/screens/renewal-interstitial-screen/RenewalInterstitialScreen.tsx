import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import Card from '@bluelightcard/shared-ui/components/Card';
import { useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { generateRenewalTitle } from '@/root/src/member-eligibility/renewal/screens/renewal-interstitial-screen/hooks/RenewalMessageBuilder';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';

export const RenewalInterstitialScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const isMobile = useMobileMediaQuery();
  const renewalMessage = generateRenewalTitle();

  const renewalMessageStyles = useMemo(() => {
    const font = isMobile ? fonts.headline : fonts.displaySmallText;

    return `text-center md:text-wrap ${font}`;
  }, [isMobile]);

  const subtitleStyles = useMemo(() => {
    const font = isMobile ? fonts.titleMedium : fonts.titleLarge;

    return `text-center mt-4 mb-6 text-nowrap ${font}`;
  }, [isMobile]);

  const paymentCardDescription = useMemo(() => {
    const price = BRAND === BRANDS.BLC_AU ? '$9.95' : '£4.99';

    return `Secure your exclusive membership for just ${price}. Enjoy another two years of savings and special offers.`;
  }, []);

  const fuzzyFrontEndButtons = useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Renewal Account Details Screen',
          });
        },
        text: 'Full flow',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            skipAccountDetails: true,
            currentScreen: 'Employment Status Screen',
          });
        },
        text: 'Skip straight to employment details',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
          });
        },
        text: 'Skip straight to payment',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <EligibilityScreen data-testid="Renewal Intersititial Screen">
      <EligibilityBody>
        <div className={renewalMessageStyles}>
          {renewalMessage.part1}

          {/*Adding a line break here for blc-uk and blc-au only as per designs*/}
          {renewalMessage.part2 === 'Blue Light ' && <br />}
          <span className="bg-gradient-to-b from-colour-secondary-gradient-bright-fixed to-colour-secondary-gradient-centre-fixed bg-clip-text text-transparent">
            {renewalMessage.part2}
          </span>
          {renewalMessage.part3}
        </div>

        <div className={`mt-[-8px] ${subtitleStyles}`}>
          You have three steps to complete
          <br />
          before you can continue saving
        </div>

        <div className="flex flex-col self-center md:w-[450px] sm:w-[400px] gap-[24px]">
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
            description={`Provide your job details and work email for quick verification, or upload an eligible form of ID.`}
            initialCardState="default"
            canHover={false}
          />

          <Card
            cardTitle="Make a Payment"
            description={paymentCardDescription}
            initialCardState="default"
            canHover={false}
          />
        </div>
      </EligibilityBody>
      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
