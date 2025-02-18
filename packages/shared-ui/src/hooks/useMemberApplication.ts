import useMemberProfileGet from './useMemberProfileGet';
import { ApplicationSchema } from '../components/CardVerificationAlerts/types';

const useMemberApplication = () => {
  const { isLoading, memberProfile } = useMemberProfileGet();

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
