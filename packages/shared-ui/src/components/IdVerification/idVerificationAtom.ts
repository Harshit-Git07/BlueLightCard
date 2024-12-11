import { atom } from 'jotai';
import { IdVerificationAtom } from './IdVerificationTypes';

export const initializeIdVerificationAtom = (
  isDoubleId: boolean,
  memberUuid: string,
): IdVerificationAtom => {
  return {
    selectedMethod: null,
    isDoubleId,
    memberUuid,
  };
};

export const idVerificationAtom = atom(initializeIdVerificationAtom(false, ''));
