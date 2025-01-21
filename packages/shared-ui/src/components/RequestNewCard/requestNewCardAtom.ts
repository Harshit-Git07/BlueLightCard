import { atom } from 'jotai';
import { RequestNewCardAtom } from './requestNewCardTypes';
import { sequenceIdUpload } from './requestNewCardStep';

export const initializeRequestNewCardAtom = (): RequestNewCardAtom => ({
  preferredStep: 0,
  currentStep: 0,
  sequence: sequenceIdUpload,
  verificationMethod: '',
});

export const requestNewCardAtom = atom(initializeRequestNewCardAtom());
