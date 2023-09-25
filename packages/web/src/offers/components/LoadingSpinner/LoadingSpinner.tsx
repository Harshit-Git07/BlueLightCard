import { faSpinner } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LoadingPlaceholder = () => {
  return (
    <div className="w-full h-[400px] flex justify-center">
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin m-auto text-[3em] text-palette-primary dark:text-palette-secondary"
      />
    </div>
  );
};

export default LoadingPlaceholder;
