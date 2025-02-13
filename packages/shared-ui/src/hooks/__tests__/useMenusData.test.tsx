import '@testing-library/jest-dom';
import { Suspense } from 'react';
import { RenderOptions, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { ErrorBoundary } from 'react-error-boundary';
import { V5_API_URL } from '../../constants';
import { allMenusMock, singleMenusMock } from '../../mocks';
import useMenusData from '../useMenusData';

let mockPlatformAdapter: ReturnType<typeof useMockPlatformAdapter>;

const wrapper: RenderOptions['wrapper'] = ({ children }) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <PlatformAdapterProvider adapter={mockPlatformAdapter}>
        <ErrorBoundary fallback="error">
          <Suspense fallback="loading">{children}</Suspense>
        </ErrorBoundary>
      </PlatformAdapterProvider>
    </QueryClientProvider>
  );
};

describe('useMenusData', () => {
  describe('it calls the menus V5 API', () => {
    beforeEach(() => {
      mockPlatformAdapter = useMockPlatformAdapter();
      mockPlatformAdapter.invokeV5Api.mockReturnValue(
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: allMenusMock,
          }),
        }),
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

      test('if the response status code is not 200', async () => {
        mockPlatformAdapter.invokeV5Api.mockReturnValue(
          Promise.resolve({
            status: 500,
            data: {
              data: '',
            },
          }),
        );

        renderHook(() => useMenusData(), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[0][0]).toMatchObject({
            detail: new Error('Received error when trying to retrieve menus'),
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
          }),
        );

        renderHook(() => useMenusData(), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[0][0]).toMatchObject({
            detail: new Error('Invalid menus data received'),
          });
        });
      });
    });

    describe('and returns the result', () => {
      test('for all menus', async () => {
        const { result } = renderHook(() => useMenusData(), {
          wrapper,
        });

        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(V5_API_URL.Menus, {
          method: 'GET',
          queryParameters: {
            dob: '1984-01-24',
            organisation: ' ',
          },
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toEqual(true);
          expect(result.current.data).toEqual(allMenusMock);
        });
      });

      test('for a single menu', async () => {
        mockPlatformAdapter.invokeV5Api.mockReturnValue(
          Promise.resolve({
            status: 200,
            data: JSON.stringify({
              data: singleMenusMock,
            }),
          }),
        );

        const { result } = renderHook(() => useMenusData(['dealsOfTheWeek']), {
          wrapper,
        });

        expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(V5_API_URL.Menus, {
          method: 'GET',
          queryParameters: {
            id: 'dealsOfTheWeek',
            dob: '1984-01-24',
            organisation: ' ',
          },
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toEqual(true);
          expect(result.current.data).toEqual(singleMenusMock);
        });
      });
    });
  });
});
