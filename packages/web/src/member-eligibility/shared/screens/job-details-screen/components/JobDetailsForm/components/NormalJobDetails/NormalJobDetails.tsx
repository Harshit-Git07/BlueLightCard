import React, { FC } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/use-organisations/UseOrganisations';
import { useEmployers } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/use-employers/UseEmployers';
import { useOnOrganisationChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseOnOrganisationChanged';
import { useEmployerChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseEmployerChanged';
import { useOnJobTitleChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseOnJobTitleChange';
import { useOnPromoCodeChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseOnPromoCodeChange';
import { useShouldShowPromoCode } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseShouldShowPromoCode';
import { useOnPromoCodeApplied } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseOnPromoCodeApplied';
import { Dropdown } from '@bluelightcard/shared-ui/index';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import PromoCode from '@bluelightcard/shared-ui/components/PromoCode';

interface NormalJobDetailsProps {
  eligibilityDetailsState: EligibilityDetailsState;
  isNextButtonDisabled: boolean;
}

export const NormalJobDetails: FC<NormalJobDetailsProps> = ({
  eligibilityDetailsState,
  isNextButtonDisabled,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const organisations = useOrganisations(eligibilityDetails);
  const onOrganisationSelected = useOnOrganisationChanged(eligibilityDetailsState);

  const employers = useEmployers(eligibilityDetails);
  const onEmployerSelected = useEmployerChanged(eligibilityDetailsState);

  const onJobTitleChange = useOnJobTitleChange(eligibilityDetailsState);

  const { promoCode, onPromoCodeChanged } = useOnPromoCodeChange(eligibilityDetailsState);
  const shouldShowPromoCode = useShouldShowPromoCode(eligibilityDetails);
  const { promoCodeStatus, onPromoCodeApplied, onPromoCodeCleared } =
    useOnPromoCodeApplied(promoCode);

  return (
    <div className="flex flex-col w-full gap-[16px]">
      <Dropdown
        placeholder="Select your organisation"
        options={organisations}
        maxItemsShown={4}
        selectedValue={eligibilityDetails.organisation?.id}
        searchable
        showTooltipIcon
        onSelect={onOrganisationSelected}
      />

      {employers !== undefined && employers.length !== 0 && (
        <Dropdown
          placeholder="Select your employer"
          options={employers}
          maxItemsShown={4}
          selectedValue={eligibilityDetails.employer?.id}
          searchable
          onSelect={onEmployerSelected}
        />
      )}

      {(employers?.length === 0 || eligibilityDetails.employer) && (
        <div className="w-full flex flex-col gap-[16px]">
          <TextInput
            placeholder="Enter job title"
            onChange={onJobTitleChange}
            value={eligibilityDetails.jobTitle}
            message={isNextButtonDisabled ? 'Please enter a valid job title' : undefined}
            isValid={!isNextButtonDisabled}
          />

          {shouldShowPromoCode && (
            <PromoCode
              className="w-full"
              infoMessage="This will allow you to skip some steps"
              value={promoCode}
              onApply={onPromoCodeApplied}
              onChange={onPromoCodeChanged}
              onRemove={onPromoCodeCleared}
              variant={promoCodeStatus}
              icon
            />
          )}
        </div>
      )}
    </div>
  );
};
