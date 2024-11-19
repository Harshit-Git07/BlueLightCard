import Link from 'next/link';
import GooglePlaySVG from '@assets/google-store-button-white-text.svg';
import AppleSVG from '@assets/apple-store-button-white-text.svg';
import { FC, useMemo } from 'react';
import { useMedia } from 'react-use';
import { appleStoreUrl } from '@/root/src/common/constants/AppleStoreUrl';
import { googleStoreUrl } from '@/root/src/common/constants/GoogleStoreUrl';

type AppDownloadLinksProps = {
  className?: string;
};

export const AppStoreLinks: FC<AppDownloadLinksProps> = ({ className = '' }) => {
  const isStacked = useMedia('(max-width: 358px)');

  const downloadLinksStyles = useMemo(() => {
    return isStacked ? 'flex-col' : 'flex-row';
  }, [isStacked]);

  return (
    <div
      data-testid="download-links"
      className={`${className} ${downloadLinksStyles} col-span-3 order-4 flex justify-center items-center gap-[23px]`}
    >
      <Link href={appleStoreUrl} title="Get the app on Apple store">
        <AppleSVG className="w-[150px] h-[43px]" />
      </Link>

      <Link href={googleStoreUrl} title="Get the app on Google Play store">
        <GooglePlaySVG className="w-[150px] h-[43px]" />
      </Link>
    </div>
  );
};
