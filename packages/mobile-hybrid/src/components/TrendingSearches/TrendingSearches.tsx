import React, { FC } from 'react';
import { TrendingSearchesProps } from './types';
import { faSearch } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Heading from '@bluelightcard/shared-ui/components/Heading';

const TrendingSearches: FC<TrendingSearchesProps> = ({ trendingSearches, onTermClick }) => {
  return (
    <div className="ml-2">
      <Heading
        headingLevel="h2"
        className="mb-2 text-base text-neutral-grey-900 dark:text-neutral-white pl-3 font-bold"
      >
        Trending searches
      </Heading>
      {trendingSearches.map((search) => (
        <div key={search.id}>
          <button
            className="pl-3 py-3 dark:text-neutral-white text-base w-full h-full text-left"
            onClick={() => onTermClick(search.text)}
          >
            <FontAwesomeIcon
              icon={faSearch}
              size="lg"
              className="pr-3 text-primary-dukeblue-700 dark:text-colour-primary-dark"
              aria-hidden="true"
            />
            {search.text}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TrendingSearches;
