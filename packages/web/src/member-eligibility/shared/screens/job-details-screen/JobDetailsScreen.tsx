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
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/components/EligibilityHeading';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { useIsNextButtonDisabled } from './hooks/UseIsButtonDisabled';
import { useEmployers } from './hooks/UseEmployers';
import { useOnOrganisationChanged } from './hooks/UseOnOrganisationChanged';
import { useOrganisations } from './hooks/UseOrganisations';
import { useEmployerChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/UseEmployerChanged';
import { useOnJobTitleChange } from './hooks/UseOnJobTitleChange';
import { useOnPromoCodeChange } from './hooks/UseOnPromoCodeChange';
import { useFuzzyFrontendButtons } from './hooks/UseFuzzyFrontEndButtons';

export const JobDetailsScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const isNextButtonDisabled = useIsNextButtonDisabled(eligibilityDetails);
  const employers = useEmployers(eligibilityDetails.organisation);
  const organisations = useOrganisations();

  const { onOrganisationSelected } = useOnOrganisationChanged(eligibilityDetailsState);
  const { onEmployerSelected } = useEmployerChanged(eligibilityDetailsState);
  const { onJobTitleChange } = useOnJobTitleChange(eligibilityDetailsState);
  const { promoCode, onPromoCodeChange } = useOnPromoCodeChange(eligibilityDetailsState);
  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 1;
      case 'Renewal':
        return 2;
    }
  }, [eligibilityDetails.flow]);

  // This will be replaced by logic from APIs - for now it's just displaying the fact that promo codes are not available to every type of organisation
  const showPromoCode = eligibilityDetails.organisation !== 'Police';

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
          title="Verify Eligibility"
          subtitle="Provide details about your employment status and job role"
          numberOfCompletedSteps={numberOfCompletedSteps}
        />

        <div className="flex flex-col items-start w-full">
          <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>EMPLOYMENT STATUS</p>

          <ListSelector
            title="Employed"
            className="mt-[12px] mb-[16px]"
            state={ListSelectorState.Selected}
            onClick={onBack}
          />

          <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>JOB DETAILS</p>

          <Dropdown
            options={organisations}
            className={'mt-[12px]'}
            showTooltipIcon={true}
            maxItemsShown={5}
            placeholder={'Select your organisation'}
            onSelect={(option) => {
              onOrganisationSelected(option.label);
            }}
          />

          {employers !== undefined && employers.length !== 0 && (
            <Dropdown
              className={'mt-[16px]  mt-4'}
              options={employers}
              placeholder={'Select your employer'}
              onSelect={(option) => {
                onEmployerSelected(option.label);
              }}
            />
          )}

          {(employers?.length === 0 || eligibilityDetails.employer) && (
            <div className={'mt-[16px] w-full'}>
              <TextInput
                placeholder={'Enter job title'}
                onChange={onJobTitleChange}
                value={eligibilityDetails.jobTitle}
              />
              {showPromoCode && (
                <PromoCode
                  onApply={() => {}}
                  onChange={onPromoCodeChange}
                  className={'mt-[24px] w-full'}
                  infoMessage={'This will allow you to skip some steps'}
                  icon={true}
                  value={promoCode}
                />
              )}
            </div>
          )}

          <Button
            size={'Large'}
            className={'mt-[24px] w-full'}
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
      </EligibilityBody>
      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
