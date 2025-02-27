import { atom } from 'jotai';
import type { V2ApisGetOfferResponse, V2ApisGetEventResponse } from '@blc-mono/offers-cms/api';
import { type AmplitudeEvent, PlatformVariant } from '../../types';
import type { OfferMeta, RedemptionType } from './types';

export const initializeOfferSheetAtom = () => {
  return {
    isOpen: false,
    onClose: () => {},
    offerMeta: {} as OfferMeta,
    offerDetails: {} as V2ApisGetOfferResponse,
    eventDetails: {} as V2ApisGetEventResponse,
    platform: PlatformVariant.MobileHybrid,
    showRedemptionPage: false,
    // TODO: Remove this (use platform adapter directly)
    amplitudeEvent: (() => {}) as AmplitudeEvent | null,
    redemptionType: '' as RedemptionType | undefined,
    responsiveWeb: false as boolean | undefined,
    qrCodeValue: undefined as string | undefined,
  };
};

export const offerSheetAtom = atom(initializeOfferSheetAtom());
export type OfferSheetAtom = ReturnType<typeof initializeOfferSheetAtom>;
