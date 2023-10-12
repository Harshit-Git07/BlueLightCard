import React, { FC } from 'react';
import { OfferCardProps } from './types';
import Link from '@/components/Link/Link';
import Image from '@/components/Image/Image';
import OfferCardDetails from './OfferCardDetails';

const OfferCard: FC<OfferCardProps> = ({
  imageSrc,
  offerName,
  companyName,
  alt,
  offerLink,
  variant = 'standard',
  addBackground = false,
  id,
}) => {
  const backgroundRootClasses = addBackground
    ? 'rounded-lg shadow-md dark:bg-surface-secondary-dark'
    : '';

  const backgroundSecondaryClasses = addBackground ? 'rounded-t-lg' : '';

  return (
    <div className={`w-full h-full relative pb-5 mb-2 ${backgroundRootClasses}`} data-testid={id}>
      <Link href={offerLink} useLegacyRouting>
        <div>
          <Image
            src={imageSrc}
            alt={alt}
            fill={false}
            width={0}
            height={0}
            sizes="100vw"
            className={`h-auto w-full ${backgroundSecondaryClasses}`}
            quality={75}
          />
        </div>
        <OfferCardDetails
          offerName={offerName}
          companyName={companyName}
          offerLink={offerLink}
          variant={variant}
          xPaddingClassName={addBackground ? 'px-5' : 'px-2'}
        />
      </Link>
    </div>
  );
};
export default OfferCard;
