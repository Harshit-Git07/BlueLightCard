import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface LoadingPlaceholderProps {
  containerClassName?: string;
  spinnerClassName?: string;
}
const LoadingSpinner = ({ containerClassName, spinnerClassName }: LoadingPlaceholderProps) => {
  return (
    <div className={`${containerClassName} flex justify-center`}>
      <FontAwesomeIcon
        icon={faSpinner}
        className={`animate-spin m-auto text-colour-onSurface dark:text-colour-onSurface-dark ${spinnerClassName}`}
      />
    </div>
  );
};

export default LoadingSpinner;
