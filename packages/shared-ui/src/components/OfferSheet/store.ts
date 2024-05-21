import { atom } from 'jotai';
import { AmplitudeArg, AmplitudeEvent, PlatformVariant } from '../../types';
import { OfferDetails, OfferMeta, RedemptionType } from './types';

export const initializeOfferSheetAtom = () => {
  return {
    isOpen: false,
    onClose: () => {},
    offerMeta: {} as OfferMeta,
    offerDetails: {} as OfferDetails,
    platform: PlatformVariant.MobileHybrid,
    cdnUrl: '',
    isMobileHybrid: false,
    showRedemptionPage: false,
    // TODO: Remove this (use platform adapter directly)
    amplitudeEvent: ((arg: AmplitudeArg) => {}) as AmplitudeEvent | null,
    BRAND: '',
    redemptionType: '' as RedemptionType | undefined,
    height: '80%',
  };
};

export const offerSheetAtom = atom(initializeOfferSheetAtom());
