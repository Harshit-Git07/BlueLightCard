import { IdVerificationAtom, IdVerificationMethod } from './IdVerificationTypes';
import { getVerificationMethods, idVerificationText } from './IdVerificationConfig';
import { idVerificationAtom, initializeIdVerificationAtom } from './idVerificationAtom';
import { useAtomValue, useSetAtom } from 'jotai';

const useIdVerification = () => {
  const { selectedMethod, isDoubleId, memberUuid } = useAtomValue(idVerificationAtom);
  const setIdVerificationAtom = useSetAtom(idVerificationAtom);
  const { methods, mandatory } = getVerificationMethods(isDoubleId);

  const updateVerification = (updates: Partial<IdVerificationAtom>) => {
    setIdVerificationAtom((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const resetVerification = () => {
    setIdVerificationAtom(initializeIdVerificationAtom(isDoubleId, memberUuid));
  };

  const setMethod = (newMethod: IdVerificationMethod | null) => {
    updateVerification({ selectedMethod: newMethod });
  };

  return {
    title: idVerificationText.title,
    memberUuid,
    selectedMethod,
    setMethod,
    methods,
    mandatory,
    updateVerification,
    resetVerification,
    isDoubleId,
  };
};

export default useIdVerification;
