import { FC } from 'react';
import { SearchResults } from '../types';
import ListItem from '@/components/ListItem/ListItem';

export interface Props {
  results: SearchResults;
  onOfferClick: (companyId: number, offerId: number) => void;
}

/**
 * Presenter renders the search results
 * @param {Props} props.results - array of search results provided by it's container
 */
const SearchResultsPresenter: FC<Props> = ({ results, onOfferClick }) => {
  return (
    <div role="list" className="px-4 py-6">
      {!results.length && <p className="text-center py-4 dark:text-white">No results found.</p>}
      {results.map((offer) => (
        <div key={offer.id} role="listitem" className="mb-4">
          <ListItem
            title={offer.offername}
            text={offer.companyname}
            onClick={() => onOfferClick(offer.compid, offer.id)}
            imageSrc={offer.s3logos}
            imageAlt={offer.offername}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchResultsPresenter;
