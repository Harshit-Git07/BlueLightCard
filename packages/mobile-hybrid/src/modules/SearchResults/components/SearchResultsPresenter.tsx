import { FC } from 'react';
import { OfferListItem, SearchResults } from '../types';
import ListItem from '@/components/ListItem/ListItem';

export interface Props {
  results: SearchResults;
  onOfferClick: (offerListItem: OfferListItem) => void;
}

/**
 * Presenter renders the search results
 * @param {Props} props.results - array of search results provided by it's container
 */
const SearchResultsPresenter: FC<Props> = ({ results, onOfferClick }) => {
  return (
    <div role="list" className="px-4 py-6">
      {!results.length && <p className="text-center py-4 dark:text-white">No results found.</p>}
      {results.map((offer, index) => (
        <div key={offer.id} role="listitem" className="mb-4">
          <ListItem
            title={offer.offername}
            text={offer.companyname}
            onClick={() =>
              onOfferClick({
                companyId: offer.compid,
                companyName: offer.companyname,
                offerId: offer.id,
                offerName: offer.offername,
                searchResultNumber: index + 1,
              })
            }
            imageSrc={offer.s3logos}
            imageAlt={offer.offername}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchResultsPresenter;
