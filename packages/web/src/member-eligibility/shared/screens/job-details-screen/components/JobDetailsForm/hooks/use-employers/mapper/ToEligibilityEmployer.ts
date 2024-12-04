import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';

export function toEligibilityEmployer(
  serviceLayerEmployer: ServiceLayerEmployer
): EligibilityEmployer {
  return {
    id: serviceLayerEmployer.employerId,
    label: serviceLayerEmployer.name,
  };
}
