import { V2ApisGetOfferResponse } from '@blc-mono/offers-cms/api';

export const offerTypeLabelMap: { [key in V2ApisGetOfferResponse['type']]: string } = {
  'gift-card': 'Gift Card',
  'in-store': 'In-store',
  online: 'Online',
  local: 'Local',
  other: 'Other',
  ticket: 'Ticket',
};
