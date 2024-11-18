import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-organisations/types/ServiceLayerOrganisation';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

export function toEligibilityOrganisation(
  serviceLayerOrganisation: ServiceLayerOrganisation
): EligibilityOrganisation {
  return {
    id: serviceLayerOrganisation.organisationId,
    label: serviceLayerOrganisation.name,
  };
}
