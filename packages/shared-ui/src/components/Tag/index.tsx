import React, { FC } from 'react';
import { TagProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cssUtil } from '../../utils/cssUtil';
const Tag: FC<TagProps> = ({ state = 'Default', iconLeft, iconRight, infoMessage }) => {
  const colorTokens: Record<string, any> = {
    Default: {
      bg: 'bg-colour-surface-container-light dark:bg-colour-surface-container-dark',
      text: 'text-colour-onSurface-light dark:text-colour-onSurface-dark',
      border: 'border-[0.5px] border-colour-onSurface-light dark:border-colour-onSurface-dark',
    },
    Success: {
      bg: 'bg-colour-success-bright-light dark:bg-colour-success-bright-dark',
      text: 'text-colour-onSuccess-bright-light dark:text-colour-onSuccess-bright-dark',
      border:
        'border-[0.5px] border-colour-onSuccess-bright-light dark:border-colour-onSuccess-bright-dark',
    },
    Warning: {
      bg: 'bg-colour-warning-bright-light dark:bg-colour-warning-bright-dark',
      text: 'text-colour-onWarning-bright-light dark:text-colour-onWarning-bright-dark',
      border:
        'border-[0.5px] border-colour-onWarning-bright-light dark:border-colour-onWarning-bright-dark',
    },
    Error: {
      bg: 'bg-colour-error-bright-light dark:bg-colour-error-bright-dark',
      text: 'text-colour-onError-bright-light dark:text-colour-onError-bright-dark',
      border:
        'border-[0.5px] border-colour-onError-bright-light dark:border-color-onError-bright-dark',
    },
    Info: {
      bg: 'bg-colour-info-bright-light dark:bg-colour-info-bright-dark',
      text: 'text-colour-onInfo-bright-light dark:text-colour-onInfo-bright-dark',
      border:
        'border-[0.5px] border-colour-onInfo-bright-light dark:border-colour-onInfo-bright-dark',
    },
  };

  const tokenClasses = colorTokens[state] || colorTokens['Default'];
  const borderRadius = 'rounded';

  const classes = cssUtil([
    'inline-flex h-6 min-h-6 py-1 px-2 justify-center items-center gap-1',
    tokenClasses.bg,
    tokenClasses.text,
    tokenClasses.border,
    borderRadius,
  ]);

  return (
    <div className={classes}>
      {iconLeft && (
        <span className="flex items-center">
          <FontAwesomeIcon className="mr-1 text-current" icon={iconLeft} size="sm" />
        </span>
      )}
      <span className="font-typography-label-semibold font-typography-label-semibold-weight text-typography-label-semibold leading-typography-label-semibold">
        {infoMessage}
      </span>
      {iconRight && (
        <span className="flex items-center">
          <FontAwesomeIcon className="ml-1 text-current" icon={iconRight} size="sm" />
        </span>
      )}
    </div>
  );
};

export default Tag;
