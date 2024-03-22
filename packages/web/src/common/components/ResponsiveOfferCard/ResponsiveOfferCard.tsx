import { FC, useState } from 'react';
import Image from '@/components/Image/Image';
import { BgColorTagParser, ResponsiveOfferCardProps } from './types';
import getCDNUrl from '@/utils/getCDNUrl';
import Badge from '../Badge/Badge';
import { useOfferSheetControls } from '@/context/OfferSheet/hooks';

const ResponsiveOfferCard: FC<ResponsiveOfferCardProps> = ({
  id,
  companyId,
  companyName,
  type,
  name,
  image,
  variant = 'vertical',
}) => {
  const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

  const { open } = useOfferSheetControls();
  const [imageSource, setImageSource] = useState(getCDNUrl(image));

  const openOfferSheet = () => {
    open({
      offerId: id,
      companyId,
      companyName,
    });
  };

  const tagBackground: BgColorTagParser = {
    Online: 'bg-[#BCA5F7]',
    'In-store': 'bg-[#E9C46A]',
    'Gift card': 'bg-[#EC779E]',
  };

  return (
    <div
      className={`w-full h-full relative overflow-hidden ${
        variant === 'vertical' ? 'desktop:p-2 desktop:pb-4 pb-0' : 'py-3 flow-root'
      }`}
      data-testid={`offer-card-${id}`}
    >
      <div
        onClick={openOfferSheet}
        className={`rounded-t-lg overflow-hidden ${
          variant === 'vertical' ? '' : 'rounded-lg h-16 float-left mr-3'
        }`}
      >
        <Image
          src={imageSource}
          alt={`${name} offer`}
          width={0}
          height={0}
          sizes="100vw"
          className={`h-auto w-full !relative`}
          quality={75}
          onError={() => {
            setImageSource(fallbackImage);
          }}
        />
      </div>

      <Badge
        label={type}
        color={tagBackground[type]}
        size={variant === 'vertical' ? 'large' : 'small'}
      />
      <p
        className={`font-['MuseoSans'] text-[#202125] line-clamp-2 ${
          variant === 'vertical'
            ? 'mt-2 text-xl laptop:text-2xl font-semibold'
            : 'mt-0.5 text-base font-light justify-self-start self-end'
        }`}
      >
        {name}
      </p>
    </div>
  );
};

export default ResponsiveOfferCard;
