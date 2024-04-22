/* eslint-disable @typescript-eslint/no-unused-vars */
import { atom } from 'jotai';
import { AmplitudeArg, AmplitudeEvent, PlatformVariant } from '../../types';

export const offerSheetAtom = atom({
  isOpen: false,
  onClose: () => {},
  offerMeta: {
    companyId: '',
    companyName: '',
    offerId: '',
  },
  offerDetails: {
    companyId: undefined as number | undefined,
    companyLogo: '' as string | undefined,
    description: '' as string | undefined,
    expiry: '' as string | undefined,
    id: undefined as number | undefined,
    name: '' as string | undefined,
    terms: '' as string | undefined,
    type: '' as string | undefined,
  },
  platform: PlatformVariant.Mobile,
  cdnUrl: '',
  isMobileHybrid: false,
  showRedemptionPage: false,
  amplitudeEvent: ((arg: AmplitudeArg) => {}) as AmplitudeEvent,
  BRAND: '' as string,
});
