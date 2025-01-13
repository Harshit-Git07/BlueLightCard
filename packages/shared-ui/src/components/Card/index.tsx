import { FC, useState, useRef, useEffect, useMemo, useCallback, KeyboardEvent } from 'react';
import { CardProps, CardState } from './types';
import Button from '../Button-V2';
import { debounce } from 'lodash';
import Index from './components/CardContent';
import { useMobileMediaQuery } from '../../hooks/useMediaQuery';

const Card: FC<CardProps> = ({
  initialCardState = 'default',
  cardTitle,
  description,
  truncateDescription = false,
  buttonTitle,
  imageAlt,
  imageSrc,
  iconRight,
  iconLeft,
  showImage = true,
  showDescription = true,
  showButton,
  cardOnClick,
  onClick,
  ariaLabel,
  className = '',
  imageSvg,
  canHover = true,
  ...props
}) => {
  const [cardState, setCardState] = useState<CardState>(initialCardState);
  const [isHovered, setIsHovered] = useState(false);
  const [isSingleLine, setIsSingleLine] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const isMobile = useMobileMediaQuery();

  const debouncedCheckLineCount = useCallback(
    debounce(
      () => {
        const descElement = descriptionRef.current;
        if (descElement) {
          const lineHeight = parseInt(window.getComputedStyle(descElement).lineHeight);
          setIsSingleLine(descElement.offsetHeight <= lineHeight * 1.5);
        }
      },
      150,
      {
        leading: false,
        trailing: true,
      },
    ),
    [],
  );

  useEffect(() => {
    debouncedCheckLineCount();
    window.addEventListener('resize', debouncedCheckLineCount);

    return () => {
      window.removeEventListener('resize', debouncedCheckLineCount);
      debouncedCheckLineCount.cancel();
    };
  }, [description, debouncedCheckLineCount]);

  const handleClick = useCallback(() => {
    setCardState('selected');
    onClick?.();
  }, [onClick]);

  const handleMouseEnter = useCallback(() => {
    if (!canHover) return;

    setIsHovered(true);
    if (cardState !== 'selected') {
      setCardState('hover');
    }
  }, [cardState]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      cardOnClick?.();
    }
  };

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (cardState !== 'selected') {
      setCardState('default');
    }
  }, [cardState]);

  const getStateStyles = (state: CardState) => {
    switch (state) {
      case 'selected':
        return {
          border: 'border-colour-primary dark:border-colour-primary-dark',
        };
      case 'hover':
        return {
          border:
            'group-hover:border-colour-primary-hover dark:group-hover:border-colour-primary-hover-dark border-colour-primary-hover dark:border-colour-primary-hover-dark',
        };
      case 'default':
        return {
          border: 'border-colour-onSurface-outline dark:border-colour-onSurface-outline-dark',
        };
    }
  };

  const styles = getStateStyles(cardState);

  const buttonClassName = useMemo(() => {
    const colorStyles = isHovered
      ? 'bg-button-primary-hover-bg-colour-light dark:bg-button-primary-hover-bg-colour-dark text-button-primary-hover-label-colour-light dark:text-button-primary-hover-label-colour-dark'
      : '';

    return `${colorStyles} w-full rounded-none`;
  }, [isHovered]);

  const cardTextHeightStyles = useMemo(() => {
    if (showDescription !== undefined && !showDescription) {
      return 'h-auto';
    }

    if (isMobile) {
      return `min-h-[100px] h-auto`;
    }

    return !showButton || !buttonTitle ? 'h-[100px]' : 'h-[80px]';
  }, [isMobile, showButton, buttonTitle]);

  const cardTextStyles = useMemo(() => {
    return `${cardTextHeightStyles} flex flex-row`;
  }, [cardTextHeightStyles]);

  const centerContent = !showImage || !showDescription || (showDescription && isSingleLine);

  const cardPointerStyle = cardOnClick ? 'cursor-pointer' : 'cursor-default';

  const useSvgImage = imageSvg;
  const useSrcImage = imageSrc && showImage;

  const renderCardImage = () => {
    if (useSvgImage) {
      return <div className="w-[84px] min-h-[100px] flex-shrink-0">{imageSvg}</div>;
    }

    if (useSrcImage) {
      return (
        <div className="w-[84px] min-h-[100px] flex-shrink-0">
          <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`${className} ${cardPointerStyle} w-full min-w-[275px] group`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={props['data-testid']}
      onClick={cardOnClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`${styles.border} flex flex-col border rounded overflow-hidden w-full transition-colors duration-200`}
      >
        <div className={`${cardTextStyles} ${cardPointerStyle}`}>
          {renderCardImage()}
          {cardTitle && (
            <Index
              title={cardTitle}
              description={description}
              truncateDescription={truncateDescription}
              showDescription={showDescription}
              centerContent={centerContent}
              ariaLabel={ariaLabel}
              descriptionRef={descriptionRef}
            />
          )}
        </div>

        {showButton && buttonTitle && (
          <div className="mt-auto">
            <Button
              className={buttonClassName}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              iconRight={iconRight}
              iconLeft={iconLeft}
              size="Large"
              withoutHover={true}
            >
              {buttonTitle}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
