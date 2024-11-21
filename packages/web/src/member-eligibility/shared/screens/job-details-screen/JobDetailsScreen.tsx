import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import { ListSelectorState } from '@bluelightcard/shared-ui/components/ListSelector/types';
import Dropdown from '@bluelightcard/shared-ui/components/Dropdown';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import PromoCode from '@bluelightcard/shared-ui/components/PromoCode';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { useIsNextButtonDisabled } from './hooks/UseIsButtonDisabled';
import { useOnOrganisationChanged } from './hooks/UseOnOrganisationChanged';
import { useEmployerChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/UseEmployerChanged';
import { useOnJobTitleChange } from './hooks/UseOnJobTitleChange';
import { useOnPromoCodeChange } from './hooks/UseOnPromoCodeChange';
import { useFuzzyFrontendButtons } from './hooks/UseFuzzyFrontEndButtons';
import { useOnPromoCodeApplied } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/UseOnPromoCodeApplied';
import { useOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/UseOrganisations';
import { useEmployers } from './hooks/use-employers/UseEmployers';
import { useShouldShowPromoCode } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/UseShouldShowPromoCode';
import {
  employmentDetailsSubTitle,
  defaultScreenTitle,
} from '@/root/src/member-eligibility/shared/constants/TitlesAndSubtitles';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';

export const JobDetailsScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const isNextButtonDisabled = useIsNextButtonDisabled(eligibilityDetails);
  const organisations = useOrganisations();
  const employers = useEmployers(eligibilityDetails.organisation);
  const isRenewalFlow = eligibilityDetails.flow === 'Renewal';
  const onOrganisationSelected = useOnOrganisationChanged(eligibilityDetailsState);
  const onEmployerSelected = useEmployerChanged(eligibilityDetailsState);
  const onJobTitleChange = useOnJobTitleChange(eligibilityDetailsState);
  const { promoCode, onPromoCodeChanged } = useOnPromoCodeChange(eligibilityDetailsState);

  const shouldShowPromoCode = useShouldShowPromoCode(eligibilityDetails);
  const onPromoCodeApplied = useOnPromoCodeApplied(eligibilityDetailsState);

  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 1;
      case 'Renewal':
        return 2;
    }
  }, [eligibilityDetails.flow]);

  const onBack = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Employment Status Screen',
    });
  }, [setEligibilityDetails, eligibilityDetails]);

  return (
    <EligibilityScreen data-testid="job-details-screen">
      <EligibilityBody>
        <EligibilityHeading
          title={defaultScreenTitle(eligibilityDetails.flow)}
          subtitle={employmentDetailsSubTitle(eligibilityDetails.flow)}
          numberOfCompletedSteps={numberOfCompletedSteps}
        />

        <div className="flex flex-col items-start w-full">
          <p className={`mt-[8px] ${fonts.bodySemiBold} ${colours.textOnSurface}`}>
            EMPLOYMENT STATUS
          </p>

          <ListSelector
            title={eligibilityDetails.employmentStatus}
            className="mt-[12px] mb-[16px]"
            state={ListSelectorState.Selected}
            onClick={onBack}
          />

          <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>JOB DETAILS</p>

          <Dropdown
            className="mt-[12px]"
            placeholder="Select your organisation"
            options={organisations}
            maxItemsShown={5}
            selectedValue={eligibilityDetails.organisation?.id}
            showTooltipIcon
            onSelect={(option) => {
              onOrganisationSelected(option);
            }}
          />

          {employers !== undefined && employers.length !== 0 && (
            <Dropdown
              className="mt-[16px] mt-4"
              placeholder="Select your employer"
              options={employers}
              selectedValue={eligibilityDetails.employer?.id}
              onSelect={(option) => {
                onEmployerSelected(option);
              }}
            />
          )}

          {(employers?.length === 0 || eligibilityDetails.employer) && (
            <div className="mt-[16px] w-full">
              <TextInput
                placeholder="Enter job title"
                onChange={onJobTitleChange}
                value={eligibilityDetails.jobTitle}
              />

              {shouldShowPromoCode && (
                <PromoCode
                  className="mt-[24px] w-full"
                  infoMessage="This will allow you to skip some steps"
                  value={promoCode}
                  onApply={onPromoCodeApplied}
                  onChange={onPromoCodeChanged}
                  icon
                />
              )}
            </div>
          )}

          <div className="flex w-full mt-[24px] gap-[8px]">
            {isRenewalFlow && (
              <Button
                variant={ThemeVariant.Secondary}
                className="w-1/5"
                size="Large"
                onClick={() => {
                  setEligibilityDetails({
                    ...eligibilityDetails,
                    currentScreen: 'Renewal Account Details Screen',
                  });
                }}
              >
                Back
              </Button>
            )}
            <Button
              className={isRenewalFlow ? 'w-4/5 ml-auto' : 'w-full'}
              size="Large"
              disabled={!isNextButtonDisabled}
              onClick={() => {
                setEligibilityDetails({
                  ...eligibilityDetails,
                  currentScreen: 'Verification Method Screen',
                });
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </EligibilityBody>

      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
