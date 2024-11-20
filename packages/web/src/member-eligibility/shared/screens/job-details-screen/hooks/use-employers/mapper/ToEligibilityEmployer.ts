import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/use-employers/types/ServiceLayerEmployer';
import { EligibilityEmployer } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

export function toEligibilityEmployer(
  serviceLayerEmployer: ServiceLayerEmployer
): EligibilityEmployer {
  return {
    id: serviceLayerEmployer.employerId,
    label: serviceLayerEmployer.name,
  };
}
