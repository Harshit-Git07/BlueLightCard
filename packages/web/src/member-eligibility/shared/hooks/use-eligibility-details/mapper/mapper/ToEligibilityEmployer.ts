import {
  EligibilityEmployer,
  PromoCodeEffect,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { ServiceLayerEmployer } from '@/root/src/member-eligibility/shared/types/ServiceLayerEmployer';

export function toEligibilityEmployer(
  serviceLayerEmployer: ServiceLayerEmployer
): EligibilityEmployer {
  return {
    id: serviceLayerEmployer.employerId,
    label: serviceLayerEmployer.name,
    requiresJobTitle: serviceLayerEmployer.isJobTitleMandatory ?? true,
    requiresJobReference: serviceLayerEmployer.isJobReferenceMandatory ?? false,
    promoCodeEffect: getPromoCodeEffect(serviceLayerEmployer),
  };
}

function getPromoCodeEffect(
  serviceLayerEmployer: ServiceLayerEmployer
): PromoCodeEffect | undefined {
  if (serviceLayerEmployer.bypassPayment) {
    return 'Bypass Payment';
  }

  if (serviceLayerEmployer.bypassId) {
    return 'Bypass ID';
  }

  return undefined;
}
