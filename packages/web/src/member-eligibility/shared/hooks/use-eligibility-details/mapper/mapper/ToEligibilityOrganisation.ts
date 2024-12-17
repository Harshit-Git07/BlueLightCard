import {
  ServiceLayerIdRequirements,
  ServiceLayerOrganisation,
} from '@/root/src/member-eligibility/shared/types/ServiceLayerOrganisation';
import {
  EligibilityOrganisation,
  EmploymentStatus,
  IdRequirementDetails,
  PromoCodeEffect,
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
    requiresJobTitle: true, // TODO: This still needs to be added to service layer, defaulting to true for now so behaviour is the same as before
    requiresJobReference: false, // TODO: This still needs to be added to service layer
    promoCodeEffect: getPromoCodeEffect(serviceLayerOrganisation),
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

function getPromoCodeEffect(
  serviceLayerOrganisation: ServiceLayerOrganisation
): PromoCodeEffect | undefined {
  if (serviceLayerOrganisation.bypassPayment) {
    return 'Bypass Payment';
  }

  if (serviceLayerOrganisation.bypassId) {
    return 'Bypass ID';
  }

  return undefined;
}
