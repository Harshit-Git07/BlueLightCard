import { FC, useState } from 'react';
import { cssUtil } from '@/utils/cssUtil';
import Image from '@/components/Image/Image';
import { decider } from '@/utils/decider';
import { CardLayout, CardProps } from '@/components/Card/types';
import decodeEntities from '@/utils/decodeEntities';

const Card: FC<CardProps> = ({
  title,
  text,
  textAlign,
  selected,
  imageAlt,
  imageSrc,
  imageWidth,
  imageHeight,
  layout,
  onClick,
}) => {
  const [isSelected, setIsSelected] = useState(selected);
  const fixedWidthHeight = imageWidth && imageHeight;
  const cardLayout = decider([
    [layout === CardLayout.ImageLeft, 'flex-row'],
    [layout === CardLayout.ImageTop, 'flex-col'],
  ]);
  const cardLayoutHeight = decider([
    [layout === CardLayout.ImageLeft, 'max-w-[100px]'],
    [layout === CardLayout.ImageTop && !fixedWidthHeight, 'pb-[50%]'],
  ]);
  const cardClasses = cssUtil([
    'rounded overflow-hidden shadow-md flex w-full dark:bg-neutral-grey-800',
    cardLayout ?? 'flex-col',
    onClick ? 'cursor-pointer' : '',
  ]);
  const cardImageClasses = cssUtil([
    'w-full relative bg-gray-200',
    cardLayoutHeight ?? (!fixedWidthHeight ? 'pb-[50%]' : ''),
  ]);
  const cardContentClasses = cssUtil([
    'py-2 px-5',
    layout === CardLayout.ImageLeft ? 'self-center' : '',
    textAlign ?? 'text-left',
  ]);
  const onCardClicked = () => {
    setIsSelected(!isSelected);
    if (onClick) {
      onClick(!isSelected);
    }
  };

  const cardTitleClasses = cssUtil([
    'text-lg font-medium dark:text-neutral-white overflow-hidden whitespace-nowrap overflow-ellipsis',
  ]);

  const cardParagraphClasses = cssUtil([
    'text-sm font-light dark:text-neutral-white',
    'overflow-hidden whitespace-nowrap overflow-ellipsis',
  ]);

  return (
    <div
      className={cardClasses}
      role={onClick ? 'button' : undefined}
      onClick={onClick ? onCardClicked : undefined}
    >
      {imageSrc !== undefined && (
        <div className={cardImageClasses}>
          <Image
            src={imageSrc}
            width={imageWidth}
            height={imageHeight}
            responsive={!fixedWidthHeight}
            alt={imageAlt ?? ''}
          />
        </div>
      )}
      {text && (
        <div className={cardContentClasses}>
          <p className={cardParagraphClasses}>{decodeEntities(text)}</p>
          {title && <h4 className={cardTitleClasses}>{decodeEntities(title)}</h4>}
        </div>
      )}
    </div>
  );
};

export default Card;
