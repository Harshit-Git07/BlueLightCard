import { useEffect, useState } from 'react';
import {
  EligibilityDetails,
  EligibilityOrganisation,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { toEligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/mapper/ToEligibilityOrganisation';
import { organisationsStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/stubs/OrganisationStubs';
import { getOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/service-layer/GetOrganisations';
import { filterBasedOnEmploymentStatus } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/hooks/use-organisations/utils/FilterBasedOnEmploymentStatus';

export function useOrganisations(
  eligibilityDetails: EligibilityDetails
): EligibilityOrganisation[] {
  const { employmentStatus } = eligibilityDetails;

  const [organisations, setOrganisations] = useState<EligibilityOrganisation[]>(organisationsStub);

  useEffect(() => {
    getOrganisations().then((serviceLayerOrganisations) => {
      if (!serviceLayerOrganisations) return;

      const filteredServiceLayerOrganisations = filterBasedOnEmploymentStatus(
        serviceLayerOrganisations,
        employmentStatus
      );

      const asEligibilityOrganisations = filteredServiceLayerOrganisations.map((organisation) =>
        toEligibilityOrganisation(organisation, employmentStatus)
      );

      setOrganisations(asEligibilityOrganisations);
    });
  }, [employmentStatus]);

  return organisations;
}
