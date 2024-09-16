import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mergeClassnames } from '../../utils/cssUtils';

export interface LoadingPlaceholderProps {
  containerClassName?: string;
  spinnerClassName?: string;
}
const LoadingSpinner = ({ containerClassName, spinnerClassName }: LoadingPlaceholderProps) => {
  return (
    <div className={`${containerClassName} flex justify-center`}>
      <FontAwesomeIcon
        icon={faSpinner}
        className={mergeClassnames(`animate-spin m-auto ${spinnerClassName}`)}
      />
    </div>
  );
};

export default LoadingSpinner;
