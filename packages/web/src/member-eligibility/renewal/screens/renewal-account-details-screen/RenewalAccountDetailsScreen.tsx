import React, { FC } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/FuzzyFrontendButtons';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { useOnSurnameChange } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseOnSurnameChange';
import { useOnFirstNameChange } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseOnFirstNameChange';
import { SectionHeader } from './components/SectionHeader';
import { ManualAddressForm } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/ManualAddressForm';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useAccountDetailsValid } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseAccountDetailsIsValid';
import { EligibilityHeading } from '../../../shared/screens/shared/components/heading/EligibilityHeading';
import DatePicker from '@bluelightcard/shared-ui/components/DatePicker';
import { useOnDobChange } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseOnDobChange';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { useHandleNext } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseHandleNext';
import { useHandleBack } from './hooks/useHandleBack';

export const RenewalAccountDetailsScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  useLogAnalyticsPageView(eligibilityDetails);

  const onFirstNameChange = useOnFirstNameChange(eligibilityDetailsState);
  const onSurnameChange = useOnSurnameChange(eligibilityDetailsState);
  const onDobChange = useOnDobChange(eligibilityDetailsState);
  const isAccountDetailsValid = useAccountDetailsValid(eligibilityDetailsState);
  const handleNext = useHandleNext(eligibilityDetailsState);
  const handleBack = useHandleBack(eligibilityDetailsState);
  const fuzzyFrontendButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  return (
    <EligibilityScreen>
      <EligibilityBody className="gap-[24px]">
        <EligibilityHeading
          title="Review Account Details"
          subtitle="Make sure your name and date of birth are correct. Tell us where to send your new card."
          numberOfCompletedSteps={0}
        />
        <div className="flex flex-col">
          <SectionHeader
            title="ABOUT YOU"
            description="If you've changed your name since your last membership, make sure it matches the ID you'll provide in the next step."
          />

          <div className="flex flex-col gap-[16px]">
            <TextInput
              placeholder="First Name"
              onChange={onFirstNameChange}
              value={eligibilityDetails.member?.firstName}
              isRequired={true}
            />

            <TextInput
              placeholder="Surname"
              onChange={onSurnameChange}
              value={eligibilityDetails.member?.surname}
              isRequired={true}
            />

            <DatePicker
              htmlFor={''}
              onChange={onDobChange}
              value={eligibilityDetails.member?.dob}
              minAgeConstraint={16}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <SectionHeader
            title="ADDRESS"
            description="Tell us where you would like your card delivered."
          />

          <ManualAddressForm eligibilityDetailsState={eligibilityDetailsState} />
        </div>

        <div className="flex flex-row items-center justify-between w-full gap-[8px]">
          <Button variant={ThemeVariant.Secondary} size="Large" onClick={handleBack}>
            Back
          </Button>

          <Button
            size="Large"
            className="flex-1"
            onClick={handleNext}
            disabled={!isAccountDetailsValid}
          >
            Continue
          </Button>
        </div>
      </EligibilityBody>
      <FuzzyFrontendButtons buttons={fuzzyFrontendButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
