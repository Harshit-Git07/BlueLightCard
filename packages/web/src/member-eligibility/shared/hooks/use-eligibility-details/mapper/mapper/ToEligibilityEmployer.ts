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
    requiresJobTitle: true, // TODO: This still needs to be added to service layer, defaulting to true for now so behaviour is the same as before
    requiresJobReference: false, // TODO: This still needs to be added to service layer
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
