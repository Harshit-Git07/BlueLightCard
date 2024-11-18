import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

export interface Props {
  containerClassName?: string;
  spinnerClassName?: string;
}

const LoadingSpinner: FC<Props> = ({ containerClassName = '', spinnerClassName = '' }) => (
  <div className={`${containerClassName} flex justify-center`}>
    <FontAwesomeIcon
      icon={faSpinner}
      className={`${spinnerClassName} animate-spin m-auto text-colour-onSurface dark:text-colour-onSurface-dark`}
    />
  </div>
);

export default LoadingSpinner;
