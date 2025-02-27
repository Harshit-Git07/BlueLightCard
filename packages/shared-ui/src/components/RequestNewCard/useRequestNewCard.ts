import useMemberApplicationPost from '../../hooks/useMemberApplicationPost';
import useMemberApplicationPut from '../../hooks/useMemberApplicationPut';
import { useSetAtom } from 'jotai/index';
import { requestNewCardAtom } from './requestNewCardAtom';
import useRequestNewCardSequence from './useRequestNewCardSequence';
import useMemberApplication from '../../hooks/useMemberApplication';
import { isStepComplete } from './requestNewCardStep';
import { useEffect } from 'react';
import useSupportedDocs from './IdVerification/components/IdVerificationMethods/useSupportedDocs';
import useMemberProfileGet from '../../hooks/useMemberProfileGet';
import useMemberProfilePut from '../../hooks/useMemberProfilePut';
import useMemberApplicationConfirmPaymentPut from '../../hooks/useMemberApplicationConfirmPaymentPut';

const useRequestNewCard = () => {
  const setAtom = useSetAtom(requestNewCardAtom);
  const { sequence, currentStep, preferredStep } = useRequestNewCardSequence();
  const { memberProfile } = useMemberProfileGet();
  const { applicationId, application } = useMemberApplication();
  const supportingDocs = useSupportedDocs(
    memberProfile?.organisationId ?? '',
    memberProfile?.employmentStatus ?? '',
  );
  const { isDoubleId } = supportingDocs;
  const verificationMethod = application?.verificationMethod;
  //
  const mutatePost = useMemberApplicationPost();
  const mutatePut = useMemberApplicationPut(applicationId);
  const { mutateAsync: mutateMemberProfile, isPending: isPendingMemberProfilePUT } =
    useMemberProfilePut();
  const { mutateAsync: mutateConfirmPayment, isPending: isPendingConfirmPayment } =
    useMemberApplicationConfirmPaymentPut(applicationId);
  //
  const previousStep = Math.max((currentStep ?? 0) - 1, 0);
  const nextStep = Math.min((currentStep ?? 0) + 1, sequence.length - 1);

  const goBack = () =>
    setAtom((prev) => ({
      ...prev,
      preferredStep: previousStep,
      currentStep: previousStep,
    }));

  const goNext = () => setAtom((prev) => ({ ...prev, preferredStep: nextStep }));

  const mutation = applicationId ? mutatePut : mutatePost;
  const { mutateAsync, isPending: isPendingApplicationMutation } = mutation;

  const currentStepId = sequence[currentStep ?? 0];
  const isCurrentStepComplete = isStepComplete(currentStepId, application, isDoubleId);

  useEffect(() => {
    if (!isCurrentStepComplete || !preferredStep) return;
    if (preferredStep === currentStep) return;
    setAtom((prev) => ({ ...prev, currentStep: preferredStep }));
  }, [isCurrentStepComplete, preferredStep]);

  return {
    mutateAsync,
    mutateConfirmPayment,
    isPending: isPendingApplicationMutation || isPendingMemberProfilePUT || isPendingConfirmPayment,
    mutateMemberProfile,
    applicationId,
    application,
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
