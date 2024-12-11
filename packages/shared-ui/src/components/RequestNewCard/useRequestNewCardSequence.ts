import { useEffect } from 'react';
import {
  sequenceEmailVerification,
  sequenceIdUpload,
  sequenceInsideReprintPeriod,
} from './requestNewCardStep';
import useMemberId from '../../hooks/useMemberId';
import useMemberCard from './useMemberCard';
import { useAtomValue, useSetAtom } from 'jotai/index';
import { requestNewCardAtom } from './requestNewCardAtom';
import useMemberApplication from './useMemberApplication';

const useRequestNewCardSequence = () => {
  const memberId = useMemberId();
  const atomValue = useAtomValue(requestNewCardAtom);
  const { verificationMethod } = atomValue;
  const isEmail = verificationMethod.toLowerCase().includes('email');
  const setAtom = useSetAtom(requestNewCardAtom);
  const { application } = useMemberApplication(memberId);
  const { insideReprintPeriod } = useMemberCard(memberId);

  const applicationReason = application?.applicationReason ?? '';

  useEffect(() => {
    if (insideReprintPeriod) {
      setAtom((prev) => ({ ...prev, sequence: sequenceInsideReprintPeriod }));
      return;
    }
    if (isEmail) {
      setAtom((prev) => ({ ...prev, sequence: sequenceEmailVerification }));
      return;
    }
    setAtom((prev) => ({ ...prev, sequence: sequenceIdUpload }));
  }, [isEmail, insideReprintPeriod]);

  useEffect(() => {
    if (applicationReason === '') {
      setAtom((prev) => ({ ...prev, currentStep: 0, preferredStep: 0 }));
    }
  }, [applicationReason]);

  return { ...atomValue, isEmail };
};

export default useRequestNewCardSequence;
