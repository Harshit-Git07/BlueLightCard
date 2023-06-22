import { FC, useState } from 'react';
import { InfoCardLayout, InfoCardProps } from './types';
import { cssUtil } from '@/utils/cssUtil';
import Image from '@/components/Image/Image';
import { decider } from '@/utils/decider';

const InfoCard: FC<InfoCardProps> = ({
  title,
  text,
  textAlign,
  selected,
  imageSrc,
  imageAlt,
  imageSizes,
  imageWidth,
  imageHeight,
  layout,
  className,
  onClick,
}) => {
  const [isSelected, setIsSelected] = useState(selected);
  const fixedWidthHeight = imageWidth && imageHeight;
  const cardLayout = decider([
    [layout === InfoCardLayout.ImageLeft, 'flex-row'],
    [layout === InfoCardLayout.ImageTop, 'flex-col'],
  ]);
  const cardLayoutHeight = decider([
    [layout === InfoCardLayout.ImageLeft, 'max-w-[100px]'],
    [layout === InfoCardLayout.ImageTop && !fixedWidthHeight, 'pb-[50%]'],
  ]);
  const cardClasses = cssUtil([
    'rounded-lg overflow-hidden border-2 flex',
    cardLayout ?? 'flex-col',
    onClick ? 'cursor-pointer' : '',
    isSelected
      ? 'border-border-card-selected-base dark:border-border-card-selected-dark'
      : 'border-border-card-base dark:border-border-card-dark',
    className ?? '',
  ]);
  const cardImageClasses = cssUtil([
    'w-full relative bg-gray-200',
    cardLayoutHeight ?? (!fixedWidthHeight ? 'pb-[50%]' : ''),
  ]);
  const cardContentClasses = cssUtil([
    'p-4 px-5',
    layout === InfoCardLayout.ImageLeft ? 'self-center' : '',
    textAlign ?? 'text-center',
  ]);
  const onCardClicked = () => {
    setIsSelected(!isSelected);
    if (onClick) {
      onClick(!isSelected);
    }
  };
  return (
    <div
      className={cardClasses}
      role={onClick ? 'button' : undefined}
      onClick={onClick ? onCardClicked : undefined}
    >
      {imageSrc && (
        <div className={cardImageClasses}>
          <Image
            src={imageSrc}
            width={imageWidth}
            height={imageHeight}
            responsive={!fixedWidthHeight}
            alt={imageAlt ?? imageSrc}
            sizes={imageSizes}
          />
        </div>
      )}
      <div className={cardContentClasses}>
        {title && <h4 className="text-lg font-semibold">{title}</h4>}
        <p className="text-font-neutral-base">{text}</p>
      </div>
    </div>
  );
};

export default InfoCard;
