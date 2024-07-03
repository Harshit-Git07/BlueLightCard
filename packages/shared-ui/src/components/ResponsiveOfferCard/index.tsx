import { FC, useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import Image from '../Image';
import Badge from '../Badge';
import getCDNUrl from '../../utils/getCDNUrl';
import { PlatformVariant, SharedProps } from '../../types';
import { useCSSConditional, useCSSMerge } from '../../hooks/useCSS';
import { offerTypeParser, OfferTypeStrLiterals } from '../../utils/offers/offerSheetParser';
import { useOfferSheetControls } from '../../context/OfferSheet/hooks';

export type BgColorString = `bg-${string}`;

export type Props = SharedProps & {
  id: number;
  type: OfferTypeStrLiterals;
  name: string;
  image: string;
  companyId: number;
  companyName: string;
  variant?: 'vertical' | 'horizontal';
  quality?: number;
  onClick?: () => void;
};

export type BgColorTagParser = {
  [key in OfferTypeStrLiterals]: BgColorString;
};

const imageSourceAtom = atom<string>('');

const ResponsiveOfferCard: FC<Props> = ({
  id,
  companyId,
  companyName,
  type,
  name,
  image,
  variant = 'vertical',
  platform,
  onClick = undefined,
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
    [offerTypeParser.Online.type]:
      'bg-badge-online-bg-colour-light dark:bg-badge-online-bg-colour-dark',
    [offerTypeParser['In-store'].type]:
      'bg-badge-instore-bg-colour-light dark:bg-badge-instore-bg-colour-dark',
    [offerTypeParser.Giftcards.type]:
      'bg-badge-giftcard-bg-colour-light dark:bg-badge-giftcard-bg-colour-dark',
  } as const;

  useEffect(() => {
    if (image) setImageSource(getCDNUrl(image));
  }, [image]);

  const dynCss = useCSSConditional({
    'desktop:p-2 desktop:pb-4': platform === PlatformVariant.Web,
  });
  const css = useCSSMerge('pb-0', dynCss);

  return (
    <div
      className={`w-full h-full relative overflow-hidden cursor-pointer ${
        variant === 'vertical' ? css : 'py-3 flow-root'
      }`}
      data-testid={`offer-card-${id}`}
    >
      <div
        onClick={onClick ? onClick : openOfferSheet}
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
        className={`font-museo text-card-description-colour-light dark:text-card-description-colour-dark line-clamp-2 ${
          variant === 'vertical'
            ? 'mt-2 text-card-vertical-small-text-font laptop:text-card-vertical-large-text-font'
            : 'mt-0.5 text-card-horizontal-text-font font-regular justify-self-start self-end'
        }`}
      >
        {name}
      </p>
    </div>
  );
};

export default ResponsiveOfferCard;
