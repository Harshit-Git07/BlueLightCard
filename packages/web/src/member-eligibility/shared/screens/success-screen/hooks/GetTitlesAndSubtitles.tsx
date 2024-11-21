import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

export function getTitlesAndSubtitles(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails] = eligibilityDetailsState;
  const isVerifyIdFlow = eligibilityDetails.fileVerification;

  if (isVerifyIdFlow) {
    return {
      title: 'Verifying Your ID',
      subtitle: (
        <>
          We&apos;ll email you once it&apos;s done. Meanwhile, explore <br /> offers and save your
          favourite brands in the app!
        </>
      ),
    };
  }

  return {
    title: eligibilityDetails.flow === 'Sign Up' ? 'Sign Up Complete!' : 'Renewal Complete!',
    subtitle: (
      <>
        Easily search for stores or brands and get discounts on <br /> the go with your virtual
        card.
      </>
    ),
  };
}
