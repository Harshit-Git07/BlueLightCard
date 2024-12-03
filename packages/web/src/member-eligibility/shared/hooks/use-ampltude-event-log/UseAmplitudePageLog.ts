import { usePlatformAdapter } from '@bluelightcard/shared-ui';
import { useEffect, useRef } from 'react';

import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function useLogAnalyticsPageView(eligibilityDetails: EligibilityDetails): void {
  const platformAdapter = usePlatformAdapter();
  const pageViewLogged = useRef<boolean>(false);
  const event = eligibilityDetails.flow === 'Sign Up' ? 'signup_view' : 'renewal_view';

  useEffect(() => {
    try {
      if (!pageViewLogged.current) {
        platformAdapter.logAnalyticsEvent(event, {
          page_name: eligibilityDetails.currentScreen,
        });
        console.log('Amplitude event logged', event);
        pageViewLogged.current = true;
      }
    } catch (error) {
      console.warn('Error sending event to Amplitude', event, {
        page_name: eligibilityDetails.currentScreen,
      });
    }
  });
}
