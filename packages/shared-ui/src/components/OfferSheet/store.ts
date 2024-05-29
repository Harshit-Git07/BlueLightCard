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
    showRedemptionPage: false,
    // TODO: Remove this (use platform adapter directly)
    amplitudeEvent: ((arg: AmplitudeArg) => {}) as AmplitudeEvent | null,
    redemptionType: '' as RedemptionType | undefined,
    responsiveWeb: false as boolean | undefined,
  };
};

export const offerSheetAtom = atom(initializeOfferSheetAtom());
export type OfferSheetAtom = ReturnType<typeof initializeOfferSheetAtom>;
