import { atom } from 'jotai';
import { IdVerificationAtom } from './IdVerificationTypes';

export const initializeIdVerificationAtom = (
  isDoubleId: boolean,
  memberId: string,
): IdVerificationAtom => {
  return {
    verificationMethod: null,
    isDoubleId,
    memberId,
  };
};

export const idVerificationAtom = atom(initializeIdVerificationAtom(false, ''));
