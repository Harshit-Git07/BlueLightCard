import { formatDateDDMMYYYY } from '../utils/dates';

interface OfferDetails {
  companyId?: number;
  companyLogo?: string;
  description?: string;
  expiry?: string;
  id?: number;
  name?: string;
  terms?: string;
  type?: string;
}

export function createLabels(offerData: OfferDetails) {
  if (!offerData.expiry) return [offerData.type].filter(Boolean);
  return [offerData.type, `Expires: ${formatDateDDMMYYYY(offerData.expiry)}`].filter(Boolean);
}
