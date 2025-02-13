import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { usePlatformAdapter, excludeEventCategory, CategoriesData } from '@bluelightcard/shared-ui';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { userProfile } from '@/components/UserProfileProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { renderHook, waitFor } from '@testing-library/react';
import useCategoriesData from '../useCategoriesData';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('jotai', () => ({
  useAtomValue: jest.fn(),
}));

jest.mock('@bluelightcard/shared-ui', () => ({
  usePlatformAdapter: jest.fn(),
  excludeEventCategory: jest.fn(),
}));

jest.mock('@/globals', () => ({
  V5_API_URL: {
    Categories: '/mock-api/categories',
  },
}));

jest.mock('@/components/AmplitudeProvider/store', () => ({
  experimentsAndFeatureFlags: jest.fn(),
}));

jest.mock('@/components/UserProfileProvider/store', () => ({
  userProfile: jest.fn(),
}));

jest.mock('@/components/AmplitudeProvider/amplitudeKeys', () => ({
  FeatureFlags: {
    V5_API_INTEGRATION: 'V5_API_INTEGRATION',
    ENABLE_EVENTS_AS_OFFERS_HYBRID: 'ENABLE_EVENTS_AS_OFFERS_HYBRID',
  },
}));

describe('useCategoriesData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('should return data from excludeEventCategory', () => {
    const fakeTransformedCategories = [
      { id: 'fake', name: 'transformedCategories' },
    ] as CategoriesData;
    const fakeCategoriesResponseData = [{ id: 'fake', name: 'categories' }] as CategoriesData;
    const mockPlatformAdapter = {
      invokeV5Api: jest.fn().mockResolvedValue({
        status: 200,
        data: JSON.stringify({ data: fakeCategoriesResponseData }),
      }),
    };
    (usePlatformAdapter as jest.Mock).mockReturnValue(mockPlatformAdapter);
    (useQuery as jest.Mock).mockImplementation(async ({ queryFn }) => {
      const result = await queryFn();
      return {
        data: result,
        isLoading: false,
        isError: false,
      };
    });
    (excludeEventCategory as jest.Mock).mockReturnValue(fakeTransformedCategories);

    it('when "enable-events-as-offers-hybrid" is off', async () => {
      (useAtomValue as jest.Mock).mockImplementation((atom) => {
        if (atom === experimentsAndFeatureFlags) {
          return {
            [FeatureFlags.V5_API_INTEGRATION]: 'on',
            [FeatureFlags.ENABLE_EVENTS_AS_OFFERS_HYBRID]: 'off',
          };
        }
        if (atom === userProfile) {
          return {
            dob: '1990-01-01',
            organisation: 'Mock Organisation',
          };
        }
        return null;
      });

      renderHook(() => useCategoriesData());

      await waitFor(() => {
        expect(excludeEventCategory).toHaveBeenCalledWith(fakeCategoriesResponseData, false);
      });
    });

    it('when "enable-events-as-offers-hybrid" is on', async () => {
      (useAtomValue as jest.Mock).mockImplementation((atom) => {
        if (atom === experimentsAndFeatureFlags) {
          return {
            [FeatureFlags.V5_API_INTEGRATION]: 'on',
            [FeatureFlags.ENABLE_EVENTS_AS_OFFERS_HYBRID]: 'on',
          };
        }
        if (atom === userProfile) {
          return {
            dob: '1990-01-01',
            organisation: 'Mock Organisation',
          };
        }
        return null;
      });

      renderHook(() => useCategoriesData());

      await waitFor(() => {
        expect(excludeEventCategory).toHaveBeenCalledWith(fakeCategoriesResponseData, true);
      });
    });
  });
});
