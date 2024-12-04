import type { QueryClient } from '@tanstack/react-query';
import withClientSidePagination from '../withClientSidePagination';

const getQueryDataMock = jest.fn();

const mockQueryClient = {
  getQueryData: getQueryDataMock,
} as unknown as QueryClient;
const mockPageSize = 2;
const mockQueryKey = ['mockData', mockPageSize, 1];
const mockCreatePaginatedCacheFn = jest.fn();
const mockQueryFn = jest.fn();

describe('withClientSidePagination util', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns cached data if it exists', async () => {
    const cachedData = givenCachedDataExists();
    const result = await givenPaginationFunctionIsCalled();
    thenItUsesCachedData(result, cachedData);
  });

  it('calls given query function', async () => {
    givenQueryFunctionReturns();
    givenPaginationFunctionIsCalled();
    thenMockQueryFunctionIsCalled();
  });

  it('passes query results to given cache function', async () => {
    const mockQueryResponse = givenQueryFunctionReturns();
    await givenPaginationFunctionIsCalled();
    thenCacheFunctionIsCalledWith(mockQueryResponse);
  });

  it('returns final result from cache', async () => {
    const mockQueryResponse = givenQueryFunctionReturns();
    givenCacheFunctionWritesData();

    const result = await givenPaginationFunctionIsCalled();
    const cachedData = givenCachedDataExists();

    thenMockQueryFunctionIsCalled();
    thenCacheFunctionIsCalledWith(mockQueryResponse);
    expect(result).toEqual(cachedData);
  });
});

const givenCachedDataExists = () => {
  const cachedData = { foo: 'bar' };
  getQueryDataMock.mockReturnValue(cachedData);

  return cachedData;
};
const thenItUsesCachedData = (result: any, cachedData: any) => {
  expect(getQueryDataMock).toHaveBeenCalledWith(mockQueryKey);
  expect(result).toEqual(cachedData);
};

const givenPaginationFunctionIsCalled = () =>
  withClientSidePagination(
    mockQueryClient,
    mockQueryKey,
    mockPageSize,
    mockCreatePaginatedCacheFn,
    mockQueryFn,
  );

const givenQueryFunctionReturns = () => {
  const mockQueryResponse = { foo: 'bar' };
  mockQueryFn.mockResolvedValue(mockQueryResponse);

  return mockQueryResponse;
};
const thenMockQueryFunctionIsCalled = () => expect(mockQueryFn).toHaveBeenCalled();

const givenCacheFunctionWritesData = () =>
  mockCreatePaginatedCacheFn.mockImplementation(givenCachedDataExists);
const thenCacheFunctionIsCalledWith = (result: any) =>
  expect(mockCreatePaginatedCacheFn).toHaveBeenCalledWith(
    mockQueryClient,
    result,
    mockQueryKey,
    mockPageSize,
  );
