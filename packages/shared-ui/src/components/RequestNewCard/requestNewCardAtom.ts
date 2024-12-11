import { atom } from 'jotai';
import { REQUEST_NEW_CARD_STEP, RequestNewCardAtom } from './requestNewCardTypes';

export const initializeRequestNewCardAtom = (): RequestNewCardAtom => ({
  preferredStep: 0,
  currentStep: 0,
  sequence: [REQUEST_NEW_CARD_STEP.REASON],
  verificationMethod: '',
});

export const requestNewCardAtom = atom(initializeRequestNewCardAtom());
