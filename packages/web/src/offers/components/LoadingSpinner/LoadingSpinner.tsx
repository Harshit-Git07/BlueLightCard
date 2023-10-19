import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface LoadingPlaceholderProps {
  containerClassName?: string;
  spinnerClassName?: string;
}
const LoadingPlaceholder = ({ containerClassName, spinnerClassName }: LoadingPlaceholderProps) => {
  return (
    <div className={`${containerClassName} flex justify-center`}>
      <FontAwesomeIcon icon={faSpinner} className={`animate-spin m-auto ${spinnerClassName}`} />
    </div>
  );
};

export default LoadingPlaceholder;
