import React, { FC } from 'react';
import { CardContentProps } from '../../types';

const Index: FC<CardContentProps> = ({
  title,
  description,
  showDescription = true,
  centerContent = false,
  ariaLabel,
  descriptionRef,
}) => (
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
        className="text-colour-onSurface-subtle dark:text-colour-onSurface-subtle-dark font-typography-body-small font-typography-body-small-weight text-typography-body-small leading-typography-body-small line-clamp-2 mt-1"
      >
        {description}
      </p>
    )}
  </div>
);

export default Index;
