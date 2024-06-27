import { FC } from 'react';
import { RecentSearchButtonProps } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '@fortawesome/pro-regular-svg-icons';

const RecentSearchButton: FC<RecentSearchButtonProps> = ({ text, onClick }) => {
  return (
    <div className="inline-block m-1">
      <button
        className="relative inline-block dark:text-neutral-300 text-neutral-grey-600 border rounded-full pl-9 h-[36px] pr-2 dark:border"
        onClick={onClick}
      >
        <FontAwesomeIcon
          icon={faClockRotateLeft}
          className="absolute left-1 px-2 top-1/2 text-neutral-black dark:text-neutral-white transform -translate-y-1/2"
        />
        {text}
      </button>
    </div>
  );
};

export default RecentSearchButton;
