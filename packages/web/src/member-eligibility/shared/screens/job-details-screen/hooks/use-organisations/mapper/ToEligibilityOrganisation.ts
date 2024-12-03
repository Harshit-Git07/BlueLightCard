import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import { EligibilityOrganisation } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function toEligibilityOrganisation(
  serviceLayerOrganisation: ServiceLayerOrganisation
): EligibilityOrganisation {
  return {
    id: serviceLayerOrganisation.organisationId,
    label: serviceLayerOrganisation.name,
  };
}
