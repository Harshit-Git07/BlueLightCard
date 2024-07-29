import React from 'react';
import { TextListItemProps } from './types';
import { useCSSConditional } from '../../hooks/useCSS';

const TextListItem: React.FC<TextListItemProps> = ({
  text,
  icon,
  variant = 'default',
  onClick,
}) => {
  const dynamicCss = useCSSConditional({
    'text-colour-onSurface-light dark:text-colour-onSurface-dark': variant === 'default',
    'text-colour-primary-light dark:text-colour-primary-dark cursor-pointer':
      variant === 'clickable',
  });

  return (
    <div
      className={`w-full flex items-center ${dynamicCss}`}
      onClick={onClick}
      data-testid="button"
    >
      {icon && <div className="mr-2">{icon}</div>}
      <p className="font-typography-body font-typography-body-weight text-typography-body leading-typography-body tracking-typography-body">
        {text}
      </p>
    </div>
  );
};

export default TextListItem;
