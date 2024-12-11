import { FC } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/use-organisations/UseOrganisations';
import { useOnOrganisationChanged } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseOnOrganisationChanged';
import { useOnJobTitleChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/hooks/UseOnJobTitleChange';
import { Dropdown } from '@bluelightcard/shared-ui/index';
import { SelfEmployed } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/SelfEmployedJobDetails/components/SelfEmployed/SelfEmployed';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const SelfEmployedJobDetails: FC<Props> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const organisations = useOrganisations(eligibilityDetails);
  const onOrganisationSelected = useOnOrganisationChanged(eligibilityDetailsState);
  const onJobTitleChange = useOnJobTitleChange(eligibilityDetailsState);

  return (
    <div className="flex flex-col w-full gap-[16px]">
      <Dropdown
        placeholder="Select your organisation"
        options={organisations}
        maxItemsShown={4}
        value={eligibilityDetails.organisation?.id}
        searchable
        onChange={onOrganisationSelected}
      />

      <SelfEmployed
        eligibilityDetailsState={eligibilityDetailsState}
        onJobTitleChange={onJobTitleChange}
      />
    </div>
  );
};
