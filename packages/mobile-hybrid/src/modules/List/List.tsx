import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ListProps } from './types';
import InvokeNativeNavigation from '@/invoke/navigation';
import InvokeNativeAPICall from '@/invoke/apiCall';
import useAPI from '@/hooks/useAPI';
import { apiMap, variantToQueryParam } from './api';
import { OfferListItemModel } from '@/models/offer';
import { useSetAtom } from 'jotai/react';
import { spinner } from '../Spinner/store';
import ListItem from '@/components/ListItem/ListItem';
import Button from '@/components/Button/Button';
import { offerListDataMap } from '@/data/index';
import { PAGE_SIZE } from '@/globals';

const request = new InvokeNativeAPICall();
const navigation = new InvokeNativeNavigation();

const List: FC<ListProps> = ({ listVariant, entityId }) => {
  const setSpinner = useSetAtom(spinner);
  const [results, setResults] = useState<OfferListItemModel[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const fract = (results.length - PAGE_SIZE) / PAGE_SIZE;
  const isPotentiallyMore = results.length && !String(fract).includes('.');
  const apiUrl = apiMap[listVariant];
  const queryParamName = variantToQueryParam[listVariant];

  const { response: listResponse } = useAPI<{ data: OfferListItemModel[] }>(apiUrl);

  const heading = useMemo(() => {
    const headingMap = offerListDataMap[listVariant];
    const findHeadingById = headingMap.find((data) => data.id === entityId);
    return findHeadingById?.text;
  }, [entityId, listVariant]);

  useEffect(() => {
    request.requestData(apiUrl, {
      [queryParamName]: entityId,
      page,
    });
    setIsLoadingMore(true);
  }, [apiUrl, entityId, queryParamName, page]);

  useEffect(() => {
    if (listResponse?.data) {
      setResults(results.concat(...listResponse.data));
    }
    setSpinner(false);
    setIsLoadingMore(false);
  }, [listResponse?.data]);

  const onOfferClick = useCallback<(companyId: number, offerId: number) => void>(
    (companyId, offerId) => {
      navigation.navigate(`/offerdetails.php?cid=${companyId}&oid=${offerId}`, 'search');
    },
    [],
  );

  const onLoadMoreClick = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  return (
    <div>
      {heading && (
        <h1 className="text-2xl font-museo font-semibold text-neutral-grey-900 dark:text-primary-vividskyblue-700">
          {heading}
        </h1>
      )}
      <div className="my-4">
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
      <div className="text-center">
        {isPotentiallyMore && (
          <Button
            text={isLoadingMore ? 'Loading...' : 'Load More'}
            disabled={isLoadingMore}
            onClick={onLoadMoreClick}
          />
        )}
      </div>
    </div>
  );
};

export default List;
