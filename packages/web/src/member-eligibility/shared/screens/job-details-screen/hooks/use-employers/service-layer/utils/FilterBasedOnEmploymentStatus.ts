import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';
import { EmploymentStatus } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function filterBasedOnEmploymentStatus(
  serviceLayerEmployers: ServiceLayerEmployer[],
  employmentStatus: EmploymentStatus | undefined
): ServiceLayerEmployer[] {
  return serviceLayerEmployers.filter((serviceLayerEmployer) => {
    if (!employmentStatus) return true;

    switch (employmentStatus) {
      case 'Employed':
        return serviceLayerEmployer.employmentStatus?.includes('EMPLOYED');
      case 'Retired or Bereaved':
        return serviceLayerEmployer.employmentStatus?.includes('RETIRED');
      case 'Volunteer':
        return serviceLayerEmployer.employmentStatus?.includes('VOLUNTEER');
    }
  });
}
