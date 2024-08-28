import { FC, useState } from 'react';
import getCDNUrl from '../../utils/getCDNUrl';
import Image from '../Image';
import Link from '../Link';

export type CampaignCardProps = {
  name: string;
  image: string;
  linkUrl: string;
  className?: string;
};

const CampaignCard: FC<CampaignCardProps> = ({ name, image, linkUrl, className }) => {
  const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

  const [imageSource, setImageSource] = useState(image);

  if (!imageSource) {
    setImageSource(getCDNUrl(image));
  }

  return (
    <div className={`relative w-full ${className}`}>
      <Link href={linkUrl}>
        <Image
          src={image}
          alt={`${name} banner`}
          className="w-full h-auto object-contain"
          onError={() => {
            setImageSource(fallbackImage);
          }}
        />
      </Link>
    </div>
  );
};

export default CampaignCard;
