import { useEffect, useState } from 'react';
import {
  EligibilityDetails,
  EligibilityEmployer,
  EligibilityOrganisation,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { validate } from 'uuid';
import { toEligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/mapper/ToEligibilityEmployer';
import { getEmployers } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-employers/service-layer/GetEmployers';
import { organisationNoEmployersStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/stubs/OrganisationStubs';

// TODO: This will be removed once service layer is fully integrated
const employersStub: EligibilityEmployer[] = [
  {
    id: '1',
    label: 'Employer 1',
    requiresJobTitle: true,
    requiresJobReference: false,
  },
  {
    id: '2',
    label: 'Employer 2',
    requiresJobTitle: true,
    requiresJobReference: false,
  },
  {
    id: '3',
    label: 'Employer 3',
    requiresJobTitle: true,
    requiresJobReference: false,
  },
];

export function useEmployers(
  eligibilityDetails: EligibilityDetails
): EligibilityEmployer[] | undefined {
  const { organisation, employmentStatus } = eligibilityDetails;

  const [employers, setEmployers] = useState<EligibilityEmployer[] | undefined>(
    getInitialState(eligibilityDetails.organisation)
  );

  useEffect(() => {
    if (!organisation) return;

    // TODO: If it is not a valid uuid then we know it's a stub so will short circuit. This can be removed later once integration is complete
    if (!validate(organisation.id)) {
      setEmployers(getInitialState(organisation));
      return;
    }

    getEmployers(organisation.id).then((serviceLayerEmployers) => {
      if (!serviceLayerEmployers) return;

      const asEligibilityEmployers = serviceLayerEmployers.map(toEligibilityEmployer);

      setEmployers(asEligibilityEmployers);
    });
  }, [organisation, employmentStatus]);

  return employers;
}

function getInitialState(
  organisation: EligibilityOrganisation | undefined
): EligibilityEmployer[] | undefined {
  if (organisation === undefined) return undefined;
  // TODO: We want to stub the behaviour of no employers, and therefore not showing the dropdown. This can be removed later once service layer integration is complete
  if (organisation.id === organisationNoEmployersStub.id) return [];

  return employersStub;
}
