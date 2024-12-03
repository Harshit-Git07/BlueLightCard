import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { useMemo } from 'react';
import { organisationPromocodeStub } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/stubs/OrganisationStubs';

export function useShouldShowPromoCode(eligibilityDetails: EligibilityDetails): boolean {
  return useMemo(() => {
    // TODO: Replace this with actual logic from the organisation / employer response object
    return eligibilityDetails.organisation?.id === organisationPromocodeStub.id;
  }, [eligibilityDetails.organisation?.id]);
}
