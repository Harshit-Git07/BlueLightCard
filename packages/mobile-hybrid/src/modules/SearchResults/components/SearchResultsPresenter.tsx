import { FC } from 'react';
import { OfferListItem, SearchResults } from '../types';
import ListItem from '@/components/ListItem/ListItem';
import { Drawer, OfferSheet } from '@bluelightcard/shared-ui';

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
    <div role="list" className="mt-6">
      {!results.length && (
        <p className="text-center dark:text-listItem-text-colour-dark text-listItem-text-colour-light font-typography-title-small font-typography-title-small-weight text-typography-title-small leading-typography-title-small tracking-typography-title-small">
          No results found
        </p>
      )}
      {results.map((offer, index) => (
        <div key={offer.id} role="listitem">
          <div className="p-4 border-b border-listItem-divider-colour-light dark:border-listItem-divider-colour-dark">
            <Drawer
              drawer={OfferSheet}
              companyId={offer.compid}
              offerId={offer.id}
              companyName={offer.companyname || ''}
            >
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
            </Drawer>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsPresenter;
