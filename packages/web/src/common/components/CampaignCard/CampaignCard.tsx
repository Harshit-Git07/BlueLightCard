import { FC, useState } from 'react';
import { CampaignCardProps } from './types';
import getCDNUrl from '@/utils/getCDNUrl';
import Image from '@/components/Image/Image';
import Link from '@/components/Link/Link';

const CampaignCard: FC<CampaignCardProps> = ({ name, image, linkUrl }) => {
  const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

  const [imageSource, setImageSource] = useState(getCDNUrl(image));

  return (
    <div className="relative w-full h-[200px]">
      <Link href={linkUrl}>
        <Image
          src={imageSource}
          alt={`${name} banner`}
          className="w-full"
          onError={() => {
            setImageSource(fallbackImage);
          }}
        />
      </Link>
    </div>
  );
};

export default CampaignCard;
