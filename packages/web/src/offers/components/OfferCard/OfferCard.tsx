import React, { FC, useContext, useState } from 'react';
import { OfferCardProps } from './types';
import Link from '@/components/Link/Link';
import Image from '@/components/Image/Image';
import OfferCardDetails from './OfferCardDetails';
import getCDNUrl from '@/utils/getCDNUrl';
import AmplitudeContext from '@/context/AmplitudeContext';
import UserContext from '@/context/User/UserContext';
import { logOfferView } from '@/utils/amplitude/logOfferView';
import { usePathname } from 'next/navigation';

const OfferCard: FC<OfferCardProps> = ({
  imageSrc,
  offerName,
  companyName,
  alt,
  offerLink,
  variant = 'standard',
  addBackground = false,
  id,
  offerTag,
  withBorder = false,
  upperCaseTitle = false,
  showFindOutMore = false,
  fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`),
  offerId,
  companyId,
  hasLink = true,
  onClick = undefined,
}) => {
  const pathname = usePathname();
  const amplitude = useContext(AmplitudeContext);
  const userCtx = useContext(UserContext);

  const backgroundRootClasses = addBackground
    ? 'rounded-lg shadow-md dark:bg-surface-secondary-dark'
    : '';

  const borderClasses = withBorder ? 'rounded-lg border border-gray-200 dark:border-gray-700' : '';

  const backgroundSecondaryClasses = addBackground ? 'rounded-t-lg' : '';

  const [imageSource, setImageSource] = useState(imageSrc);

  const logClick = (eventSource: string) => {
    logOfferView(
      amplitude,
      userCtx.user?.uuid || '',
      eventSource,
      pathname,
      offerId,
      offerName,
      companyId,
      companyName
    );
  };

  const body = (
    <>
      <div onClick={() => onClick && onClick()} className="w-full h-auto aspect-[2/1]">
        <Image
          src={imageSource}
          alt={alt}
          fill={false}
          width={0}
          height={0}
          sizes="100vw"
          className={`h-auto w-full ${backgroundSecondaryClasses} !relative`}
          quality={75}
          onError={() => {
            setImageSource(fallbackImage);
          }}
        />
        <OfferCardDetails
          offerName={offerName}
          companyName={companyName}
          offerLink={showFindOutMore ? offerLink : undefined}
          variant={variant}
          xPaddingClassName={'px-5'}
          offerTag={offerTag}
          upperCaseTitle={upperCaseTitle}
        />
      </div>
    </>
  );

  return (
    <div
      className={`w-full h-full relative pb-5 mb-2 ${backgroundRootClasses} ${borderClasses} overflow-hidden`}
      data-testid={id}
    >
      {hasLink && (
        <Link href={offerLink} useLegacyRouting onClick={() => logClick('page')}>
          {body}
        </Link>
      )}
      {!hasLink && body}
    </div>
  );
};
export default OfferCard;
