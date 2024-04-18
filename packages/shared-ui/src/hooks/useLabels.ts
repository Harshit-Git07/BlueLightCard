import { OfferDetails } from '../components/OfferSheet/types';
import { formatDateDDMMYYYY } from '../utils/dates';

export function useLabels(offerData: OfferDetails) {
  if (!offerData.expiry) return [offerData.type].filter(Boolean);
  return [offerData.type, `Expiry: ${formatDateDDMMYYYY(offerData.expiry)}`].filter(Boolean);
}
