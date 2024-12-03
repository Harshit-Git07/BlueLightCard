import { useEffect, useState } from 'react';
import { getOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/service-layer/GetOrganisations';
import { toEligibilityOrganisation } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/mapper/ToEligibilityOrganisation';
import {
  EligibilityDetails,
  EligibilityOrganisation,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import {
  fuzzyFrontendActionStubs,
  organisationsStub,
} from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/stubs/OrganisationStubs';
import { filterBasedOnEmploymentStatus } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/service-layer/utils/FilterBasedOnEmploymentStatus';

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
      const asEligibilityOrganisations =
        filteredServiceLayerOrganisations.map(toEligibilityOrganisation);
      setOrganisations([...asEligibilityOrganisations, ...fuzzyFrontendActionStubs]);
    });
  }, [employmentStatus]);

  return organisations;
}
