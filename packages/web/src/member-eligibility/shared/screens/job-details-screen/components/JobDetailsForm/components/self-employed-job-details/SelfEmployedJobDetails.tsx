import { FC } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { Dropdown } from '@bluelightcard/shared-ui/index';
import { useOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/UseOrganisations';
import { useOnOrganisationChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/shared/hooks/UseOnOrganisationChanged';
import { SelfEmployed } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/self-employed-job-details/components/self-employed/SelfEmployed';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const SelfEmployedJobDetails: FC<Props> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const organisations = useOrganisations(eligibilityDetails);
  const onOrganisationSelected = useOnOrganisationChanged(eligibilityDetailsState, organisations);

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

      <SelfEmployed eligibilityDetailsState={eligibilityDetailsState} />
    </div>
  );
};
