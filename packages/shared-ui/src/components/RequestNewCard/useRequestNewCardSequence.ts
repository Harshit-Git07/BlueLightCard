import { useEffect } from 'react';
import {
  isStepComplete,
  sequenceAll,
  sequenceEmailVerification,
  sequenceIdUpload,
  sequenceIdUploadOnly,
  sequenceInsideReprintPeriod,
} from './requestNewCardStep';
import useMemberId from '../../hooks/useMemberId';
import useMemberCard from '../../hooks/useMemberCard';
import { useAtomValue, useSetAtom } from 'jotai/index';
import { requestNewCardAtom } from './requestNewCardAtom';
import useMemberApplication from '../../hooks/useMemberApplication';
import useSupportedDocs from './IdVerification/components/IdVerificationMethods/useSupportedDocs';
import useMemberProfileGet from '../../hooks/useMemberProfileGet';
import { IdType } from '@blc-mono/shared/models/members/enums/IdType';

const useRequestNewCardSequence = () => {
  const memberId = useMemberId();
  const atomValue = useAtomValue(requestNewCardAtom);
  const setAtom = useSetAtom(requestNewCardAtom);

  const { application } = useMemberApplication(memberId);
  const { insideReprintPeriod } = useMemberCard(memberId);
  const { memberProfile } = useMemberProfileGet(memberId);
  const { mandatory } = useSupportedDocs(
    memberProfile?.organisationId ?? '',
    memberProfile?.employmentStatus ?? '',
  );
  const isEmail = application?.verificationMethod?.toLowerCase().includes('email');
  const rejected = application?.rejectionReason && application.applicationReason === 'LOST_CARD';

  useEffect(() => {
    if (insideReprintPeriod) {
      setAtom((prev) => ({ ...prev, sequence: sequenceInsideReprintPeriod }));
      return;
    }
    if (isEmail) {
      setAtom((prev) => ({ ...prev, sequence: sequenceEmailVerification }));
      return;
    }
    if (rejected) {
      setAtom((prev) => ({ ...prev, sequence: sequenceIdUploadOnly }));
      return;
    }
    if (!mandatory || mandatory?.type !== IdType.TRUSTED_DOMAIN) {
      setAtom((prev) => ({ ...prev, sequence: sequenceIdUpload }));
      return;
    }

    setAtom((prev) => ({ ...prev, sequence: sequenceAll }));
  }, [isEmail, rejected, insideReprintPeriod, mandatory]);

  useEffect(() => {
    if (atomValue.currentStep !== null || atomValue.sequence.length < 1) return;

    const sequence = atomValue.sequence;

    for (const step of sequence) {
      if (!isStepComplete(step, application)) {
        setAtom((prev) => ({
          ...prev,
          currentStep: sequence.indexOf(step),
          preferredStep: sequence.indexOf(step),
        }));
        break;
      }
    }
  }, [atomValue]);

  return { ...atomValue, isEmail };
};

export default useRequestNewCardSequence;
