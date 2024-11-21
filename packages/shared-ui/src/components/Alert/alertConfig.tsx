import { AlertColorConfigProps, State } from './alertTypes';

import { fas, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export const alertColorConfig: AlertColorConfigProps = {
  Default: {
    iconColor: 'text-colour-onSurface-light dark:text-colour-onSurface-dark',
    backgroundColor: 'bg-colour-surface-container-light dark:bg-colour-surface-container-dark',
  },
  Success: {
    iconColor: 'text-colour-success-light dark:text-colour-success-dark',
    backgroundColor: 'bg-colour-success-bright-light dark:bg-colour-success-container-dark',
  },
  Info: {
    iconColor: 'text-colour-onInfo-container-light dark:text-colour-onInfo-container-dark',
    backgroundColor: 'bg-colour-info-bright-light dark:bg-colour-info-bright-dark',
  },
  Warning: {
    iconColor: 'text-colour-onWarning-container-light dark:text-colour-onWarning-container-dark',
    backgroundColor: 'bg-colour-warning-bright-light dark:bg-colour-warning-bright-dark',
  },
  Error: {
    iconColor: 'text-colour-onError-container-light dark:text-colour-onError-container-dark',
    backgroundColor: 'bg-colour-error-bright-light dark:bg-colour-error-bright-dark',
  },
};

const iconMapper: { [key in State]: IconDefinition | null } = {
  Default: null,
  Success: fas.faCheckCircle,
  Info: fas.faInfoCircle,
  Warning: fas.faExclamationTriangle,
  Error: fas.faTimesCircle,
};

export const getIconByStateOrString = (state: State, icon?: string): IconProp | null => {
  if (icon && fas[icon as keyof typeof fas]) {
    return fas[icon as keyof typeof fas];
  }

  if (state && iconMapper[state] !== null) {
    return iconMapper[state];
  }

  return null;
};
