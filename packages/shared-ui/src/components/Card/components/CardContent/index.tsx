import React, { FC, useMemo } from 'react';
import { CardContentProps } from '../../types';

const Index: FC<CardContentProps> = ({
  title,
  description,
  showDescription = true,
  centerContent = false,
  ariaLabel,
  descriptionRef,
  truncateDescription = true,
}) => {
  const descriptionTruncationStyles = useMemo(() => {
    return `${truncateDescription ? 'line-clamp-2' : ''}`;
  }, []);

  return (
    <div
      className={`flex-grow pl-3 pr-2 py-2 flex flex-col ${centerContent ? 'justify-center' : ''}`}
    >
      <label
        className="text-colour-onSurface dark:text-colour-onSurface-dark font-typography-body-semibold font-typography-body-semibold-weight text-typography-body-semibold leading-typography-body-semibold"
        aria-label={ariaLabel}
      >
        {title}
      </label>

      {showDescription && description && (
        <p
          ref={descriptionRef}
          className={`text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small ${descriptionTruncationStyles}`}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default Index;
