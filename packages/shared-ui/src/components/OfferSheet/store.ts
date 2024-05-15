import { atom } from 'jotai';
import { AmplitudeArg, AmplitudeEvent, PlatformVariant } from '../../types';
import { OfferDetails, OfferMeta } from './types';

const initializeOfferSheetAtom = () => {
  return {
    isOpen: false,
    onClose: () => {},
    offerMeta: {} as OfferMeta,
    offerDetails: {} as OfferDetails,
    platform: PlatformVariant.MobileHybrid,
    cdnUrl: '',
    isMobileHybrid: false,
    showRedemptionPage: false,
    amplitudeEvent: ((arg: AmplitudeArg) => {}) as AmplitudeEvent | null,
    BRAND: '',
  };
};

export const offerSheetAtom = atom(initializeOfferSheetAtom());
