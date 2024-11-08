import type { V2ApisGetOfferResponse } from '@blc-mono/offers-cms/api';
import { formatDateDMMMYYYY } from '../utils/dates';

export function useLabels(offerData: V2ApisGetOfferResponse) {
  if (!offerData.expires) return [offerData.type].filter(Boolean);
  return [offerData.type, `Expiry: ${formatDateDMMMYYYY(offerData.expires)}`].filter(Boolean);
}
