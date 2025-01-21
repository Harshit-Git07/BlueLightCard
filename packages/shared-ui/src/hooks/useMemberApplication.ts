import useMemberProfileGet from './useMemberProfileGet';
import { ApplicationSchema } from '../components/CardVerificationAlerts/types';

const useMemberApplication = (memberId: string) => {
  const { isLoading, memberProfile } = useMemberProfileGet(memberId);
  const hasApplication = memberProfile && memberProfile?.applications?.length >= 1;
  const application: ApplicationSchema | null = hasApplication
    ? memberProfile.applications.at(-1) ?? null
    : null;
  const applicationId = application?.applicationId ?? '';

  return {
    isLoading,
    hasApplication,
    application,
    applicationId,
  };
};

export default useMemberApplication;
