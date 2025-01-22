import React, { FC, useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { Dropdown } from '@bluelightcard/shared-ui/index';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import PromoCode from '@bluelightcard/shared-ui/components/PromoCode';
import { useOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/UseOrganisations';
import { useOnOrganisationChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/shared/hooks/UseOnOrganisationChanged';
import { useEmployers } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-employers/UseEmployers';
import { useEmployerChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/UseEmployerChanged';
import { useOnPromoCodeChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/UseOnPromoCodeChange';
import { useJobReferenceField } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/UseJobReferenceField';
import { useJobTitleField } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/shared/hooks/UseJobTitleField';
import { useOnPromoCodeApplied } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-on-promocode-applied/UseOnPromoCodeApplied';

interface NormalJobDetailsProps {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const NormalJobDetails: FC<NormalJobDetailsProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const organisations = useOrganisations(eligibilityDetails);
  const onOrganisationSelected = useOnOrganisationChanged(eligibilityDetailsState, organisations);

  const employers = useEmployers(eligibilityDetails);
  const onEmployerSelected = useEmployerChanged(eligibilityDetailsState, employers);

  const { showJobTitleField, isValidJobTitle, onJobTitleFieldChanged } = useJobTitleField(
    eligibilityDetailsState,
    employers
  );

  const { showJobReferenceField, isValidJobReference, onJobReferenceFieldChange } =
    useJobReferenceField(eligibilityDetailsState, employers);

  const { promoCode, onPromoCodeChanged } = useOnPromoCodeChange(eligibilityDetailsState);
  const { promoCodeStatus, onPromoCodeApplied, onPromoCodeCleared } =
    useOnPromoCodeApplied(eligibilityDetailsState);

  const canUsePromoCode = useMemo(() => {
    return (
      eligibilityDetails.employer?.promoCodeEffect ??
      eligibilityDetails.organisation?.promoCodeEffect
    );
  }, [
    eligibilityDetails.employer?.promoCodeEffect,
    eligibilityDetails.organisation?.promoCodeEffect,
  ]);

  return (
    <div className="flex flex-col w-full gap-[16px]">
      <Dropdown
        data-testid="organisation-dropdown"
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
          data-testid="employer-dropdown"
          placeholder="Select your employer"
          options={employers}
          maxItemsShown={4}
          selectedValue={eligibilityDetails.employer?.id}
          searchable
          onSelect={onEmployerSelected}
        />
      )}

      {showJobTitleField && (
        <TextInput
          data-testid="job-title"
          placeholder="Enter job title"
          onChange={onJobTitleFieldChanged}
          value={eligibilityDetails.jobTitle}
          message={!isValidJobTitle ? 'Please enter a valid job title' : undefined}
          isValid={isValidJobTitle}
        />
      )}

      {showJobReferenceField && (
        <TextInput
          data-testid="job-reference"
          placeholder="Job reference number"
          onChange={onJobReferenceFieldChange}
          value={eligibilityDetails.jobReference}
          message={!isValidJobReference ? 'Please enter a valid job reference number' : undefined}
          isValid={isValidJobReference}
        />
      )}

      {canUsePromoCode && (
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
  );
};
