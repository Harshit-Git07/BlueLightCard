import { FC, KeyboardEvent, useEffect, useState } from 'react';
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
  tabIndex?: number;
  onClick?: () => void;
};

export type BgColorTagParser = {
  [key in OfferTypeStrLiterals]: BgColorString;
};

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
  tabIndex = 0,
}) => {
  const fallbackImage = getCDNUrl(`/misc/Logo_coming_soon.jpg`);

  const { open } = useOfferSheetControls();
  const [imageSource, setImageSource] = useState<string>(image ? getCDNUrl(image) : fallbackImage);

  const openOfferSheet = () => {
    open({
      offerId: id,
      companyId,
      companyName,
    });
  };

  const onCardInteraction = () => {
    if (onClick) return onClick();

    openOfferSheet();
  };

  const onCardKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;

    onCardInteraction();
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
      role="button"
      aria-label={`${companyName}: ${name}`}
      tabIndex={tabIndex}
      onClick={onCardInteraction}
      onKeyDown={onCardKeyDown}
    >
      <div
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
        className={`text-card-description-colour-light dark:text-card-description-colour-dark line-clamp-2 ${
          variant === 'vertical'
            ? 'mt-2 text-card-vertical-small-text-font font-card-vertical-small-text-font font-card-vertical-small-text-font-weight tracking-card-vertical-small-text-font leading-card-vertical-small-text-font laptop:text-card-vertical-large-text-font laptop:font-card-vertical-large-text-font laptop:font-card-vertical-large-text-font-weight laptop:leading-font-card-vertical-large-text-font laptop:tracking-font-card-vertical-large-text-font'
            : 'mt-0.5 text-card-horizontal-text-font font-card-horizontal-text-font font-card-horizontal-text-font-weight tracking-card-horizontal-text-font leading-card-horizontal-text-font justify-self-start self-end'
        }`}
      >
        {name}
      </p>
    </div>
  );
};

export default ResponsiveOfferCard;
