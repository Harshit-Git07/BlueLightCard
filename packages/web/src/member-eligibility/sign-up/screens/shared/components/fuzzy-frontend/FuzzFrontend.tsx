import React, { FC } from 'react';
import { fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { Link, ThemeVariant } from '@bluelightcard/shared-ui/index';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';

interface Props {
  screenTitle: string;
  figmaLink: string;
  eligibilityDetailsState: EligibilityDetailsState;
  buttons?: FuzzFrontendButtonProps[];
  onBack?: () => void;
}

export interface FuzzFrontendButtonProps {
  onClick: () => void;
  text: string;
}

export const FuzzyFrontend: FC<Props> = ({
  screenTitle,
  figmaLink,
  eligibilityDetailsState,
  buttons = [],
  onBack,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  return (
    <EligibilityScreen>
      <EligibilityBody className="gap-8">
        <div className="flex flex-col justify-center gap-1">
          <div className={fonts.titleLarge} data-testid="fuzzy-frontend-title">
            {screenTitle}
          </div>

          <div className={`${fonts.body} text-center italic`}>Fuzzy frontend</div>
        </div>

        <Link
          className={`${fonts.titleMediumSemiBold} text-rose-300`}
          href={figmaLink}
          target="_blank"
        >
          Click here to see Design
        </Link>

        <pre>{JSON.stringify(eligibilityDetails, null, 2)}</pre>

        <div className="flex flex-col gap-2">
          {onBack && (
            <Button
              data-testid="back-button"
              onClick={onBack}
              size="Large"
              variant={ThemeVariant.Secondary}
              withoutHover
            >
              Back
            </Button>
          )}

          {buttons.map((button, index) => (
            <Button
              data-testid={`next-button-${index + 1}`}
              key={button.text}
              onClick={button.onClick}
              size="Large"
              withoutHover
            >
              {button.text}
            </Button>
          ))}
        </div>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
