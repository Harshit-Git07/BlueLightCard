import '@testing-library/jest-dom';
import { Suspense } from 'react';
import { RenderOptions, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PlatformAdapterProvider,
  flexibleOfferMock,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui';
import { ErrorBoundary } from 'react-error-boundary';
import _noop from 'lodash/noop';
import useFlexibleOffersData from '../useFlexibleOffersData';
import { Factory } from 'fishery';
import UserContext, { UserContextType } from '../../context/User/UserContext';

let mockPlatformAdapter: ReturnType<typeof useMockPlatformAdapter>;

const userContextTypeFactory = Factory.define<UserContextType>(() => ({
  dislikes: [],
  error: undefined,
  isAgeGated: false,
  setUser: _noop,
  user: {
    companies_follows: [],
    legacyId: 'mock-legacy-id',
    profile: {
      dob: 'mock-dob',
      organisation: 'mock-organisation',
    },
    uuid: 'mock-uuid',
  },
}));

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
  const userContext = userContextTypeFactory.build();

  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserContext.Provider value={userContext}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <ErrorBoundary fallback="error">
            <Suspense fallback="loading">{children}</Suspense>
          </ErrorBoundary>
        </PlatformAdapterProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
};

describe('useFlexibleOffersData', () => {
  describe('it calls the flexible offers V5 API', () => {
    beforeEach(() => {
      mockPlatformAdapter = useMockPlatformAdapter();
      mockPlatformAdapter.invokeV5Api.mockReturnValue(
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: flexibleOfferMock,
          }),
        })
      );
    });

    describe('and throws an error', () => {
      let consoleMock: jest.SpyInstance;

      beforeEach(() => {
        consoleMock = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      });

      afterEach(() => {
        consoleMock.mockReset();
      });

      test('if a valid flexi menu ID is not provided', async () => {
        renderHook(() => useFlexibleOffersData(''), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[0][0]).toMatchObject({
            detail: new Error('Valid flexi menu ID not provided'),
          });
        });
      });

      test('if the response status code is not 200', async () => {
        mockPlatformAdapter.invokeV5Api.mockReturnValue(
          Promise.resolve({
            status: 500,
            data: {
              data: '',
            },
          })
        );

        renderHook(() => useFlexibleOffersData('test-menu-id-1'), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[0][0]).toMatchObject({
            detail: new Error('Received error when trying to retrieve flexible offers'),
          });
        });
      });

      test('if the response data is not valid', async () => {
        mockPlatformAdapter.invokeV5Api.mockReturnValue(
          Promise.resolve({
            status: 200,
            data: {
              data: {},
            },
          })
        );

        renderHook(() => useFlexibleOffersData('test-menu-id-1'), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[0][0]).toMatchObject({
            detail: new Error('Invalid flexible offers data received'),
          });
        });
      });
    });

    test('and returns the result', async () => {
      const { result } = renderHook(() => useFlexibleOffersData('test-menu-id-1'), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toEqual(true);
        expect(result.current.data).toEqual(flexibleOfferMock);
      });
    });
  });
});
