import { EmploymentStatus } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { ServiceLayerOrganisation } from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';

export function filterBasedOnEmploymentStatus(
  serviceLayerOrganisations: ServiceLayerOrganisation[],
  employmentStatus: EmploymentStatus | undefined
): ServiceLayerOrganisation[] {
  return serviceLayerOrganisations.filter((serviceLayerOrganisation) => {
    if (!employmentStatus) return true;

    switch (employmentStatus) {
      case 'Employed':
        return serviceLayerOrganisation.employmentStatus?.includes('EMPLOYED');
      case 'Retired or Bereaved':
        return serviceLayerOrganisation.employmentStatus?.includes('RETIRED');
      case 'Volunteer':
        return serviceLayerOrganisation.employmentStatus?.includes('VOLUNTEER');
    }
  });
}
