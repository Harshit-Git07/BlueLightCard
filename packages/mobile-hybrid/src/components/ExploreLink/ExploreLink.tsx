import { FC } from 'react';
import { ExploreLinkProps } from './types';
import { cssUtil } from '@/utils/cssUtil';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons';

const ExploreLink: FC<ExploreLinkProps> = ({ icon, title, onClick }) => {
  const linkClasses = cssUtil([
    'dark:bg-neutral-grey-800 w-full flex justify-between font-light text-sm text-left py-3 rounded my-1 dark:border-none border border-neutral-grey-100 dark:text-neutral-white shadow-md',
  ]);

  return (
    <div className="mx-1">
      <button className={linkClasses} onClick={onClick}>
        <div className="flex justify-between">
          <FontAwesomeIcon
            className="w-12 text-primary-dukeblue-700 dark:text-primary-vividskyblue-700"
            size="lg"
            icon={icon}
          />
          {title}
        </div>
        <div>
          <FontAwesomeIcon icon={faChevronRight} className="mr-2 text-neutral-grey-400" size="lg" />
        </div>
      </button>
    </div>
  );
};

export default ExploreLink;
