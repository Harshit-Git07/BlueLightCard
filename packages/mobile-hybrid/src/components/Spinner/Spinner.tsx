import { FC } from 'react';
import { cssUtil } from '@/utils/cssUtil';

const Spinner: FC = () => {
  const spinnerClass = cssUtil([
    'path',
    'stroke-spinner-colour-light dark:stroke-spinner-colour-dark',
  ]);
  return (
    <div role="progressbar" className="p-3 rounded shadow-lg">
      <svg
        className="spinner"
        width="60px"
        height="60px"
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
