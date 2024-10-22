import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useHydrateAtoms } from 'jotai/utils';
import InvokeNativeAPICall from '@/invoke/apiCall';
import useSearch, { statusAtom, searchTermAtom, searchResultsAtom } from '../useSearch';
import { IPlatformAdapter, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { userProfile } from '@/components/UserProfileProvider/store';

const renderWithHydratedAtoms = (mockPlatformAdapter: IPlatformAdapter, atomValues: any[] = []) => {
  return renderHook(() => {
    useHydrateAtoms(atomValues);

    return useSearch(mockPlatformAdapter);
  });
};

describe('useSearch', () => {
  it('returns the correct initial state', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    const state = renderWithHydratedAtoms(mockPlatformAdapter);

    expect(state.result.current).toMatchObject({
      status: 'EMPTY',
      searchTerm: undefined,
      searchResults: [],
      doSearch: expect.any(Function),
      resetSearch: expect.any(Function),
    });
  });

  it('executes V4 searches', async () => {
    const requestMock = jest
      .spyOn(InvokeNativeAPICall.prototype, 'requestDataAsync')
      .mockResolvedValue({
        success: true,
        data: [
          {
            id: 1,
            offername: 'Test Offer 1',
            companyname: 'Test Company Name 1',
            compid: 'test-company-id-1',
            s3logos: 's3-logo-1.jpg',
            logos: 's3-logo-1.jpg',
            absoluteLogos: 's3-logo-1.jpg',
            typeid: 3,
          },
        ],
      });

    const mockPlatformAdapter = useMockPlatformAdapter();
    const state = renderWithHydratedAtoms(mockPlatformAdapter);

    await act(async () => {
      await state.result.current.doSearch('test V4 search value');
    });

    expect(requestMock).toHaveBeenCalledWith('/api/4/offer/search.php', {
      term: 'test V4 search value',
    });
    expect(state.result.current.searchTerm).toEqual('test V4 search value');
    expect(state.result.current.status).toEqual('SUCCESS');
    expect(state.result.current.searchResults).toEqual([
      {
        id: 1,
        offername: 'Test Offer 1',
        companyname: 'Test Company Name 1',
        compid: 'test-company-id-1',
        s3logos: 's3-logo-1.jpg',
        logos: 's3-logo-1.jpg',
        absoluteLogos: 's3-logo-1.jpg',
        typeid: 3,
      },
    ]);
  });

  it('has a status of "error" when V4 search fails', async () => {
    const requestMock = jest
      .spyOn(InvokeNativeAPICall.prototype, 'requestDataAsync')
      .mockResolvedValue({
        success: false,
        data: [],
      });

    const mockPlatformAdapter = useMockPlatformAdapter();
    const state = renderWithHydratedAtoms(mockPlatformAdapter);

    await act(async () => {
      await state.result.current.doSearch('test V4 search value');
    });

    expect(requestMock).toHaveBeenCalledWith('/api/4/offer/search.php', {
      term: 'test V4 search value',
    });
    expect(state.result.current.status).toEqual('ERROR');
  });

  it('executes V5 searches for searchV5 experiment', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, {
      data: [
        {
          ID: '3',
          LegacyID: 2,
          OfferName: 'Test Offer 2',
          CompanyName: 'Test Company Name 2',
          CompID: 'test-company-id-2',
          LegacyCompanyID: 4,
          offerimg: 's3-logo-2.jpg',
        },
      ],
    });
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('treatment');

    const state = renderWithHydratedAtoms(mockPlatformAdapter, [
      [
        userProfile,
        {
          service: 'test-organisation',
          dob: '1990-01-01',
        },
      ],
    ]);

    await act(async () => {
      await state.result.current.doSearch('test V5 search value');
    });

    expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith('/eu/discovery/search', {
      method: 'GET',
      queryParameters: {
        query: 'test V5 search value',
        organisation: 'test-organisation',
        dob: '1990-01-01',
      },
      cachePolicy: 'auto',
    });
    expect(state.result.current.searchTerm).toEqual('test V5 search value');
    expect(state.result.current.status).toEqual('SUCCESS');
    expect(state.result.current.searchResults).toEqual([
      {
        id: 2,
        offername: 'Test Offer 2',
        companyname: 'Test Company Name 2',
        compid: 4,
        s3logos: 's3-logo-2.jpg',
        logos: 's3-logo-2.jpg',
        absoluteLogos: 's3-logo-2.jpg',
      },
    ]);
  });

  it('resets the search state', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('treatment');

    const state = renderWithHydratedAtoms(mockPlatformAdapter, [
      [statusAtom, 'SUCCESS'],
      [searchTermAtom, 'existing search term value'],
      [searchResultsAtom, [{ id: 1 }]],
    ]);

    expect(state.result.current.status).toEqual('SUCCESS');
    expect(state.result.current.searchTerm).toEqual('existing search term value');
    expect(state.result.current.searchResults).toEqual([{ id: 1 }]);

    act(() => {
      state.result.current.resetSearch();
    });

    expect(state.result.current.status).toEqual('EMPTY');
    expect(state.result.current.searchTerm).toEqual(undefined);
    expect(state.result.current.searchResults).toEqual([]);
  });
});
