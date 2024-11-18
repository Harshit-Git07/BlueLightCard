import { useEffect, useState } from 'react';
import { getOrganisations } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/service-layer/GetOrganisations';
import { toEligibilityOrganisation } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/mapper/ToEligibilityOrganisation';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import {
  fuzzyFrontendActionStubs,
  organisationsStub,
} from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/stubs/OrganisationStubs';

export function useOrganisations(): EligibilityOrganisation[] {
  const [organisations, setOrganisations] = useState<EligibilityOrganisation[]>(organisationsStub);

  useEffect(() => {
    getOrganisations().then((serviceLayerOrganisations) => {
      if (!serviceLayerOrganisations) return;

      const asEligibilityOrganisations = serviceLayerOrganisations.map(toEligibilityOrganisation);
      setOrganisations([...asEligibilityOrganisations, ...fuzzyFrontendActionStubs]);
    });
  }, []);

  return organisations;
}
