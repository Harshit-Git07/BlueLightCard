import { OfferDetails } from '../components/OfferSheet/types';
import { formatDateDMMMYYYY } from '../utils/dates';

export function useLabels(offerData: OfferDetails) {
  if (!offerData.expiry) return [offerData.type].filter(Boolean);
  return [offerData.type, `Expiry: ${formatDateDMMMYYYY(offerData.expiry)}`].filter(Boolean);
}
