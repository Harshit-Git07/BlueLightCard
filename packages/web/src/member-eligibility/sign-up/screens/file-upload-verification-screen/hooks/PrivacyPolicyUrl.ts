import { useMemo } from 'react';

export function usePrivacyPolicyUrl(): string {
  return useMemo(() => {
    // TODO: Need answer to https://bluelightcardgroup.slack.com/archives/C07NBCLDUR0/p1730899344850089?thread_ts=1730898698.971249&cid=C07NBCLDUR0, then this should change based on the brand
    return 'https://www.bluelightcard.co.uk/privacy-notice.php';
  }, []);
}
