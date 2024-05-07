import { FC, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import Image from '@/components/Image/Image';
import { BgColorTagParser, ResponsiveOfferCardProps } from './types';
import getCDNUrl from '@/utils/getCDNUrl';
import Badge from '../Badge/Badge';
import { useOfferSheetControls } from '@/context/OfferSheet/hooks';
import { offerTypeParser } from '../../utils/offers/offerTypeParser';

const imageSourceAtom = atom<string>('');

const ResponsiveOfferCard: FC<ResponsiveOfferCardProps> = ({
  id,
  companyId,
  companyName,
  type,
  name,
  image,
  variant = 'vertical',
  quality = 75,
}) => {
  const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

  const { open } = useOfferSheetControls();
  const [imageSource, setImageSource] = useAtom(imageSourceAtom);

  const openOfferSheet = () => {
    open({
      offerId: id,
      companyId,
      companyName,
    });
  };

  const tagBackground: BgColorTagParser = {
    [offerTypeParser.Online.type]: 'bg-[#BCA5F7]',
    [offerTypeParser['In-store'].type]: 'bg-[#E9C46A]',
    [offerTypeParser.Giftcards.type]: 'bg-[#EC779E]',
  } as const;

  useEffect(() => {
    if (image) setImageSource(getCDNUrl(image));
  }, [image]);

  return (
    <div
      className={`w-full h-full relative overflow-hidden cursor-pointer ${
        variant === 'vertical' ? 'desktop:p-2 desktop:pb-4 pb-0' : 'py-3 flow-root'
      }`}
      data-testid={`offer-card-${id}`}
    >
      <div
        onClick={openOfferSheet}
        className={`rounded-t-lg overflow-hidden ${
          variant === 'vertical'
            ? ''
            : 'rounded-lg h-16 float-left mr-3 max-w-[100px] tablet:max-w-full'
        }`}
      >
        <Image
          src={imageSource}
          alt={`${name} offer`}
          width={0}
          height={0}
          sizes="100vw"
          className={`h-auto w-full !relative`}
          quality={quality}
          onError={() => {
            setImageSource(fallbackImage);
          }}
        />
      </div>

      {Object.keys(offerTypeParser).includes(type) && (
        <Badge
          label={offerTypeParser[type].label}
          color={tagBackground[type]}
          size={variant === 'vertical' ? 'large' : 'small'}
        />
      )}
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
