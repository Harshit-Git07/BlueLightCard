import Link from 'next/link';
import AppleSVG from '@assets/google-store-button-white-text.svg';
import GooglePlaySVG from '@assets/apple-store-button-white-text.svg';
import { FC } from 'react';
import {
  getAppleStoreLinkForBrand,
  getGooglePlayStoreLinkForBrand,
} from '@/root/src/member-eligibility/shared/components/modal/helper';

type AppDownloadLinksProps = {
  className?: string;
};

export const AppDownloadLinks: FC<AppDownloadLinksProps> = ({ className }) => {
  const appleStoreLink = getAppleStoreLinkForBrand();
  const googlePlayStoreLink = getGooglePlayStoreLinkForBrand();

  return (
    <div
      data-testid="download-links"
      className={`${className} col-span-3 order-4 my-4 mb-[48px] flex justify-center items-center gap-[23px]`}
    >
      <Link href={appleStoreLink} title={'Get the app on Apple store'}>
        <AppleSVG className="w-[150px] h-[43px]" />
      </Link>
      <Link href={googlePlayStoreLink} title={'Get the app on Google Play store'}>
        <GooglePlaySVG className="w-[150px] h-[43px]" />
      </Link>
    </div>
  );
};
