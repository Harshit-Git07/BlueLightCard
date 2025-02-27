import { useRouter } from 'next/navigation';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { useEffect } from 'react';
import { useMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-member-profile/UseGetMemberProfile';

export function useEligibilityRedirector(): void {
  const router = useRouter();

  const memberProfile = useMemberProfile();

  const eligibilityEnabled = useAmplitudeExperiment(
    AmplitudeExperimentFlags.MODERN_ELIGIBILITY_ENABLED,
    'off'
  );

  useEffect(() => {
    if (eligibilityEnabled.data?.variantName !== 'on') return;

    const latestApplication = memberProfile?.applications?.at(-1);
    if (!latestApplication) return;

    if (latestApplication.eligibilityStatus !== 'ELIGIBLE') {
      router.push('/eligibility');
    }
  }, [eligibilityEnabled.data?.variantName, memberProfile, router]);
}
