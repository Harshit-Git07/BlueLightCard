import { atom } from 'jotai';
import { RequestNewCardAtom } from './requestNewCardTypes';

export const initializeRequestNewCardAtom = (): RequestNewCardAtom => ({
  preferredStep: null,
  currentStep: null,
  sequence: [],
});

export const requestNewCardAtom = atom(initializeRequestNewCardAtom());
