import Link from 'next/link';
import GooglePlaySVG from '@assets/google-store-button-white-text.svg';
import AppleSVG from '@assets/apple-store-button-white-text.svg';
import { FC } from 'react';
import { useMedia } from 'react-use';
import { appleStoreUrl } from '@/root/src/common/constants/AppleStoreUrl';
import { googleStoreUrl } from '@/root/src/common/constants/GoogleStoreUrl';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { successEvents } from '@/root/src/member-eligibility/shared/screens/success-screen/amplitude-events/SuccessEvents';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';

type AppDownloadLinksProps = {
  className?: string;
  eligibilityDetails: EligibilityDetails;
};

export const AppStoreLinks: FC<AppDownloadLinksProps> = ({
  className = '',
  eligibilityDetails,
}) => {
  const logAnalyticsEvent = useLogAmplitudeEvent();

  const isStacked = useMedia('(max-width: 358px)');

  const containerStyles = computeValue(() => {
    const flexDirectionStyles = isStacked ? 'flex-col' : 'flex-row';

    return `${className} ${flexDirectionStyles} flex justify-center items-center gap-[14px]`;
  });

  const svgStyles = computeValue(() => {
    return 'w-[150px] h-[43px]';
  });

  return (
    <div className={containerStyles} data-testid="download-links">
      <Link
        title="Get the app on Apple store"
        href={appleStoreUrl}
        onClick={() => logAnalyticsEvent(successEvents.onAppleStoreClicked(eligibilityDetails))}
      >
        <AppleSVG className={svgStyles} />
      </Link>

      <Link
        title="Get the app on Google Play store"
        href={googleStoreUrl}
        onClick={() => logAnalyticsEvent(successEvents.onGooglePayClicked(eligibilityDetails))}
      >
        <GooglePlaySVG className={svgStyles} />
      </Link>
    </div>
  );
};
