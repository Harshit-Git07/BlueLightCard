import Link from 'next/link';
import GooglePlaySVG from '@assets/google-store-button-white-text.svg';
import AppleSVG from '@assets/apple-store-button-white-text.svg';
import { FC, useMemo } from 'react';
import { useMedia } from 'react-use';
import { appleStoreUrl } from '@/root/src/common/constants/AppleStoreUrl';
import { googleStoreUrl } from '@/root/src/common/constants/GoogleStoreUrl';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { successEvents } from '@/root/src/member-eligibility/shared/screens/success-screen/amplitude-events/SuccessEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

type AppDownloadLinksProps = {
  className?: string;
  eligibilityDetails: EligibilityDetails;
};

export const AppStoreLinks: FC<AppDownloadLinksProps> = ({
  className = '',
  eligibilityDetails,
}) => {
  const isStacked = useMedia('(max-width: 358px)');
  const logAnalyticsEvent = useLogAmplitudeEvent();

  const downloadLinksStyles = useMemo(() => {
    return isStacked ? 'flex-col' : 'flex-row';
  }, [isStacked]);

  return (
    <div
      data-testid="download-links"
      className={`${className} ${downloadLinksStyles} col-span-3 order-4 flex justify-center items-center gap-[23px]`}
    >
      <Link
        href={appleStoreUrl}
        onClick={() => logAnalyticsEvent(successEvents.onAppleStoreClicked(eligibilityDetails))}
        title="Get the app on Apple store"
      >
        <AppleSVG className="w-[150px] h-[43px]" />
      </Link>

      <Link
        href={googleStoreUrl}
        onClick={() => logAnalyticsEvent(successEvents.onGooglePayClicked(eligibilityDetails))}
        title="Get the app on Google Play store"
      >
        <GooglePlaySVG className="w-[150px] h-[43px]" />
      </Link>
    </div>
  );
};
