import { cssUtil } from '@/utils/cssUtil';
import { FC } from 'react';

type SpinnerProps = {
  noShadow?: boolean;
  size?: number;
};

const Spinner: FC<SpinnerProps> = ({ noShadow = false, size = 60 }) => {
  const spinnerClass = cssUtil([
    'path',
    'stroke-spinner-colour-light dark:stroke-spinner-colour-dark',
  ]);
  return (
    <div role="progressbar" className={`p-3 rounded ${noShadow ? '' : 'shadow-lg'}`}>
      <svg
        className="spinner"
        width={`${size}px`}
        height={`${size}px`}
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={spinnerClass}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          cx="33"
          cy="33"
          r="30"
        ></circle>
      </svg>
    </div>
  );
};

export default Spinner;
