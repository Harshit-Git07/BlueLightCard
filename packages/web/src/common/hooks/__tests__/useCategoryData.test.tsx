import '@testing-library/jest-dom';
import { Suspense } from 'react';
import { RenderOptions, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  PlatformAdapterProvider,
  categoryMock,
  eventCategoryDataMock,
  useMockPlatformAdapter,
} from '@bluelightcard/shared-ui';
import { ErrorBoundary } from 'react-error-boundary';
import useCategoryData from '../useCategoryData';
import * as offerTransformationsModule from '../../../../../shared-ui/src/utils/offers/offerTransformations';

jest.mock('../../../../../shared-ui/src/utils/offers/offerTransformations', () => ({
  mapCategoryEventsToOffers: jest.fn(),
}));

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

describe('useCategoryData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('it calls the category V5 API', () => {
    beforeEach(() => {
      mockPlatformAdapter = useMockPlatformAdapter();
      mockPlatformAdapter.invokeV5Api.mockReturnValue(
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: categoryMock,
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

      test('if a valid category ID is not provided', async () => {
        renderHook(() => useCategoryData('', 1, 12), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[0][0]).toMatchObject({
            detail: new Error('Valid category ID not provided'),
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

        renderHook(() => useCategoryData('test-category-id-1', 1, 12), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[0][0]).toMatchObject({
            detail: new Error('Received error when trying to retrieve category'),
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

        renderHook(() => useCategoryData('test-category-id-1', 1, 12), {
          wrapper,
        });

        await waitFor(() => {
          expect(consoleMock.mock.calls[2][0]).toMatchObject({
            detail: new Error('Invalid category data received'),
          });
        });
      });
    });

    test('and returns the result', async () => {
      const { result } = renderHook(() => useCategoryData('test-category-id-1', 1, 12), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toEqual(true);
        expect(result.current.data).toEqual({
          ...categoryMock,
          meta: {
            totalPages: 1,
          },
        });
      });
    });
  });

  describe('Mapping API response data for the view', () => {
    test(`it maps EventCategoryData when it's returned from the API`, async () => {
      const mockMapCategoryEventsToOffers = offerTransformationsModule.mapCategoryEventsToOffers;

      mockPlatformAdapter = useMockPlatformAdapter();
      mockPlatformAdapter.invokeV5Api.mockReturnValue(
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: eventCategoryDataMock,
          }),
        })
      );
      renderHook(() => useCategoryData('test-category-id-1', 1, 12), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockMapCategoryEventsToOffers).toHaveBeenCalledWith(eventCategoryDataMock);
      });
    });

    test(`it DOES NOT normalise CategoryData when it's returned from the API`, async () => {
      const mockMapCategoryEventsToOffers = offerTransformationsModule.mapCategoryEventsToOffers;

      mockPlatformAdapter = useMockPlatformAdapter();
      mockPlatformAdapter.invokeV5Api.mockReturnValue(
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: categoryMock,
          }),
        })
      );
      renderHook(() => useCategoryData('test-category-id-1', 1, 12), {
        wrapper,
      });

      await waitFor(() => {
        expect(mockMapCategoryEventsToOffers).not.toHaveBeenCalled();
      });
    });
  });
});
