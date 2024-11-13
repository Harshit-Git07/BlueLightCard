import React, { FC, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { CardProps, CardState } from './types';
import Button from '../Button-V2';
import { debounce } from 'lodash';
import Index from './components/CardContent';

const Card: FC<CardProps> = ({
  initialCardState = 'default',
  cardTitle,
  description,
  buttonTitle,
  imageAlt,
  imageSrc,
  iconRight,
  iconLeft,
  showImage = true,
  showDescription = true,
  showButton,
  onClick,
  ariaLabel,
  className,
  canHover = true,
  ...props
}) => {
  const [cardState, setCardState] = useState<CardState>(initialCardState);
  const [isHovered, setIsHovered] = useState(false);
  const [isSingleLine, setIsSingleLine] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

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
    return `w-full rounded-b-none ${
      isHovered
        ? 'bg-button-primary-hover-bg-colour-light dark:bg-button-primary-hover-bg-colour-dark text-button-primary-hover-label-colour-light dark:text-button-primary-hover-label-colour-dark'
        : ''
    }`;
  }, [isHovered]);

  const centerContent = !showImage || !showDescription || (showDescription && isSingleLine);

  return (
    <div
      className={`w-full min-w-[275px] group ${className ?? ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid={props['data-testid']}
    >
      <div
        className={`flex flex-col border rounded overflow-hidden ${styles.border} w-full transition-colors duration-200`}
      >
        <div className="flex flex-row min-h-[100px]">
          {showImage && imageSrc && (
            <div className="w-[84px] min-h-[100px] flex-shrink-0">
              <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover" />
            </div>
          )}
          {cardTitle && (
            <Index
              title={cardTitle}
              description={description}
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
              onClick={handleClick}
              iconRight={iconRight}
              iconLeft={iconLeft}
              className={buttonClassName}
              size={'Large'}
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
