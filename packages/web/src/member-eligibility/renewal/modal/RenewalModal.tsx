import { FC, useEffect, useMemo } from 'react';
import { useMediaQuery, useMobileMediaQuery } from '@bluelightcard/shared-ui/hooks/useMediaQuery';
import { RenewalModalDesktop } from '@/root/src/member-eligibility/renewal/modal/RenewalModalDesktop';
import { RenewalModalMobile } from '@/root/src/member-eligibility/renewal/modal/RenewalModalMobile';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { OnClose } from '@/root/src/member-eligibility/shared/screens/success-screen/types/OnClose';

interface Props {
  forceMobileView?: boolean;
  onClose?: OnClose;
  ifCardExpiredMoreThan30Days?: boolean;
}

export const RenewalModal: FC<Props> = ({
  forceMobileView,
  onClose,
  ifCardExpiredMoreThan30Days,
}) => {
  const platformAdapter = usePlatformAdapter();
  const isMobileInPortraitMode = useMediaQuery('(max-height: 600px) and (orientation: landscape)');
  const isMobile = useMobileMediaQuery();

  useEffect(() => {
    try {
      platformAdapter.logAnalyticsEvent('renewal_view', {
        page_name: 'Renewal Modal',
      });
    } catch (error) {
      console.warn('Error sending event to Amplitude', 'renewal_view', {});
    }
  });

  const useMobileView = useMemo(() => {
    return forceMobileView ?? (isMobile || isMobileInPortraitMode);
  }, [forceMobileView, isMobile, isMobileInPortraitMode]);

  if (useMobileView) {
    return (
      <RenewalModalMobile
        ifCardExpiredMoreThan30Days={ifCardExpiredMoreThan30Days}
        onClose={onClose}
      />
    );
  }

  return (
    <RenewalModalDesktop
      ifCardExpiredMoreThan30Days={ifCardExpiredMoreThan30Days}
      onClose={onClose}
    />
  );
};
