import useMemberApplicationPost from '../../hooks/useMemberApplicationPost';
import useMemberApplicationPut from '../../hooks/useMemberApplicationPut';
import useMemberId from '../../hooks/useMemberId';
import { useSetAtom } from 'jotai/index';
import { requestNewCardAtom } from './requestNewCardAtom';
import useRequestNewCardSequence from './useRequestNewCardSequence';
import useMemberApplication from './useMemberApplication';
import { isStepComplete } from './requestNewCardStep';
import { useEffect } from 'react';
import useMemberCard from './useMemberCard';
import useSupportedDocs from './IdVerification/components/IdVerificationMethods/useSupportedDocs';
import useMemberProfileGet from '../../hooks/useMemberProfileGet';

const useRequestNewCard = () => {
  const memberId = useMemberId();
  const setAtom = useSetAtom(requestNewCardAtom);
  const { sequence, currentStep, preferredStep, verificationMethod } = useRequestNewCardSequence();
  const { memberProfile } = useMemberProfileGet(memberId);
  const { applicationId, application } = useMemberApplication(memberId);
  const supportingDocs = useSupportedDocs(
    memberProfile?.organisationId ?? '',
    memberProfile?.employmentStatus ?? '',
  );
  const { isDoubleId } = supportingDocs;
  const { card } = useMemberCard(memberId);
  //
  const mutatePost = useMemberApplicationPost(memberId);
  const mutatePut = useMemberApplicationPut(memberId, applicationId);
  //
  const previousStep = Math.max(currentStep - 1, 0);
  const nextStep = Math.min(currentStep + 1, sequence.length - 1);

  const goBack = () => {
    console.log('goBack', { previousStep });
    setAtom((prev) => ({
      ...prev,
      preferredStep: previousStep,
      currentStep: previousStep,
    }));
  };

  const goNext = () => setAtom((prev) => ({ ...prev, preferredStep: nextStep }));

  const mutation = applicationId ? mutatePut : mutatePost;
  const { mutateAsync, isPending } = mutation;

  const currentStepId = sequence[currentStep];
  const isCurrentStepComplete = isStepComplete(
    currentStepId,
    application,
    isDoubleId,
    card,
    verificationMethod,
  );

  useEffect(() => {
    if (!isCurrentStepComplete || !preferredStep) return;
    if (preferredStep === currentStep) return;
    console.log('Moving to next step', preferredStep);
    setAtom((prev) => ({ ...prev, currentStep: preferredStep }));
  }, [isCurrentStepComplete, preferredStep]);

  return {
    mutateAsync,
    isPending,
    memberId,
    applicationId,
    previousStep,
    nextStep,
    goBack,
    goNext,
    sequence,
    currentStep,
    currentStepId,
    isCurrentStepComplete,
    verificationMethod,
    ...supportingDocs,
  };
};

export default useRequestNewCard;
