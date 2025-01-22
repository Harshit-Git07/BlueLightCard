import useMemberProfileGet from './useMemberProfileGet';
import { ApplicationSchema } from '../components/CardVerificationAlerts/types';

const useMemberApplication = (memberId: string) => {
  const { isLoading, memberProfile } = useMemberProfileGet(memberId);

  const applications = memberProfile?.applications ?? [];

  const hasApplication = applications.length >= 1;
  const application: ApplicationSchema | undefined = applications?.[0];
  const applicationId = application?.applicationId ?? '';

  return {
    isLoading,
    hasApplication,
    application,
    applicationId,
  };
};

export default useMemberApplication;
