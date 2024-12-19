import type { QueryClient } from '@tanstack/react-query';

type WriteableQueryKey = Array<string | number>;

/**
 * Helper function for adding client-side pagination to a React Query function. This
 * runs your query and then writes entries to the query cache for each page that's needed
 * from the response.
 *
 * This allows you to implement pagination into your query response and use the same
 * query API you would use as if you were using server-side pagination. This means components
 * should never need to know anything about how the pagination works and queries should be able to
 * just be seamlessly swapped between client and server side pagination when available.
 *
 * NOTE: For large data sets, server side pagination should be favoured over client side pagination if possible.
 * Client side pagination may not scale well, so be careful!
 *
 * @param queryClient The instance of the React Query client to read/write to
 * @param queryKey The query key your query is using, NOTE: the page number should be the LAST value in the key
 * @param pageSize Size of the pages you wish to create
 * @param createPaginatedCacheFn Custom callback for creating the paginated data you need from the response
 * @param queryFn The `queryFn` that your React Query is using
 * @returns The requested page of results created from the cache
 */
export async function withClientSidePagination<RawDataType, PaginatedDataType>(
  queryClient: QueryClient,
  queryKey: WriteableQueryKey,
  pageSize: number,
  createPaginatedCacheFn: (
    queryClient: QueryClient,
    dataToPaginate: RawDataType,
    queryKey: WriteableQueryKey,
    pageSize: number,
  ) => void,
  queryFn: () => Promise<RawDataType>,
) {
  // If paginated data already exists in the cache, return it
  const cachedData = queryClient.getQueryData(queryKey);
  if (cachedData) {
    return cachedData as PaginatedDataType;
  }

  // Execute query and build cache
  const response = await queryFn();
  createPaginatedCacheFn(queryClient, response, queryKey, pageSize);

  // Return initial requested page result from cache
  return queryClient.getQueryData(queryKey) as PaginatedDataType;
}

export default withClientSidePagination;
