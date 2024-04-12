import { FC } from 'react';
import { atom, useAtom } from 'jotai';
import { CampaignCardProps } from './types';
import getCDNUrl from '@/utils/getCDNUrl';
import Image from '@/components/Image/Image';
import Link from '@/components/Link/Link';

const imageSourceAtom = atom<string | null>(null);

const CampaignCard: FC<CampaignCardProps> = ({ name, image, linkUrl }) => {
  const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

  const [imageSource, setImageSource] = useAtom(imageSourceAtom);

  if (!imageSource) {
    setImageSource(getCDNUrl(image));
  }

  return (
    <div className="relative w-full h-[200px]">
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
