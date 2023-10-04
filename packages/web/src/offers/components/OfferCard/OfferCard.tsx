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
  id,
}) => {
  return (
    <div
      className="w-full h-full rounded-lg relative shadow-lg dark:bg-surface-secondary-dark pb-5 mb-5"
      data-testid={id}
    >
      <Link href={offerLink} useLegacyRouting>
        <div>
          <Image
            src={imageSrc}
            alt={alt}
            fill={false}
            width={0}
            height={0}
            sizes="100vw"
            className={'rounded-t-lg h-auto w-full'}
            quality={50}
          />
        </div>
        <OfferCardDetails offerName={offerName} companyName={companyName} variant={variant} />
      </Link>
    </div>
  );
};
export default OfferCard;
