import {
  UseQueryResult,
  DefinedQueryObserverResult,
  QueryObserverLoadingErrorResult,
  QueryObserverLoadingResult,
  QueryObserverPendingResult,
} from '@tanstack/react-query';
import { useMemo } from 'react';

export type UseDerivedQueryResult<TData, TError> =
  | Omit<DefinedQueryObserverResult<TData, TError>, 'refetch' | 'remove'>
  | Omit<QueryObserverLoadingErrorResult<TData, TError>, 'refetch' | 'remove'>
  | Omit<QueryObserverLoadingResult<TData, TError>, 'refetch' | 'remove'>
  | Omit<QueryObserverPendingResult<TData, TError>, 'refetch' | 'remove'>;

export function useDerivedQuery<TDataFrom, TErrorFrom, TDataTo = TDataFrom, TErrorTo = TErrorFrom>({
  queryKey,
  query,
  transformData,
  transformError,
}: {
  /**
   * The query is only re-executed if the queryKey changes, or if the upstream query changes.
   * Note that the queryKey is hashed, so it does not need to be memoized.
   */
  queryKey: string[];
  /**
   * Upstream query from which to derive the new query
   */
  query: UseDerivedQueryResult<TDataFrom, TErrorFrom>;
  /**
   * Transform the data from the upstream query into the new data.
   * Note that the transformData function is only called if the upstream query changes, or if the queryKey changes.
   * Therefore, it does not need to be memoized.
   *
   * @param data The data from the upstream query
   * @returns The new data
   */
  transformData?: (data: TDataFrom) => TDataTo;
  /**
   * Transform the error from the upstream query into the new error.
   * Note that the transformError function is only called if the upstream query changes, or if the queryKey changes.
   * Therefore, it does not need to be memoized.
   *
   * @param error The error from the upstream query
   * @returns The new error
   */
  transformError?: (error: TErrorFrom) => TErrorTo;
}): UseDerivedQueryResult<TDataTo, TErrorTo> {
  const queryKeyHash = JSON.stringify(queryKey);

  return useMemo(() => {
    function _transformData(data?: TDataFrom): TDataTo | undefined {
      if (data === undefined) {
        return undefined;
      }

      if (transformData) {
        return transformData(data);
      }

      return data as TDataTo;
    }

    function _transformError(error: TErrorFrom | null): TErrorTo | null {
      if (error === null) {
        return null;
      }

      if (transformError) {
        return transformError(error);
      }

      return error as TErrorTo;
    }

    const data = _transformData(query.data);
    const error = _transformError(query.error);

    return {
      ...query,
      data,
      error,
      failureReason: error,
    } as UseDerivedQueryResult<TDataTo, TErrorTo>;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- We only want to recompute this when the upstream query or the queryKey change
  }, [query, queryKeyHash]);
}
