import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';
import { EmploymentStatus } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function filterBasedOnEmploymentStatus(
  serviceLayerEmployers: ServiceLayerEmployer[],
  employmentStatus: EmploymentStatus | undefined
): ServiceLayerEmployer[] {
  return serviceLayerEmployers.filter((serviceLayerEmployer) => {
    if (!employmentStatus) return true;

    switch (employmentStatus) {
      case undefined:
        return true;
      case 'Employed':
        return serviceLayerEmployer.active;
      case 'Retired or Bereaved':
        return serviceLayerEmployer.retired;
      case 'Volunteer':
        return serviceLayerEmployer.volunteers;
    }
  });
}
