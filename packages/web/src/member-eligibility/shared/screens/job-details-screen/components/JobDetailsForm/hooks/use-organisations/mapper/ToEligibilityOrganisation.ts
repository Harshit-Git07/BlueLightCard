import {
  ServiceLayerIdRequirements,
  ServiceLayerOrganisation,
} from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import {
  EligibilityOrganisation,
  EmploymentStatus,
  IdRequirementDetails,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function toEligibilityOrganisation(
  serviceLayerOrganisation: ServiceLayerOrganisation,
  employmentStatus: EmploymentStatus | undefined
): EligibilityOrganisation {
  const relevantRequirements = getRequirementsForStatus(serviceLayerOrganisation, employmentStatus);

  const idRequirements =
    relevantRequirements?.supportedDocuments?.map(
      (supportDocument): IdRequirementDetails => ({
        title: supportDocument.title,
        description: supportDocument.description,
        guidelines: supportDocument.guidelines,
        type: supportDocument.type === 'TRUSTED_DOMAIN' ? 'email' : 'file upload',
        required: supportDocument.required,
      })
    ) ?? [];

  return {
    id: serviceLayerOrganisation.organisationId,
    label: serviceLayerOrganisation.name,
    idRequirements: idRequirements.length > 0 ? idRequirements : [],
  };
}

function getRequirementsForStatus(
  organisation: ServiceLayerOrganisation,
  status: EmploymentStatus | undefined
): ServiceLayerIdRequirements | undefined {
  if (status === undefined) {
    return;
  }

  switch (status) {
    case 'Employed':
      return organisation.employedIdRequirements;
    case 'Retired or Bereaved':
      return organisation.retiredIdRequirements;
    case 'Volunteer':
      return organisation.volunteerIdRequirements;
  }
}
