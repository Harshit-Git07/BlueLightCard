import { render, renderHook, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAtom } from 'jotai';
import UserProfileProvider from '@/components/UserProfileProvider/UserProfileProvider';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { UserProfile, userProfile } from '@/components/UserProfileProvider/store';
import { AmplitudeStore, experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useSetAtom } from 'jotai/index';
import { Experiments, FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import useUserService from '@/hooks/useUserService';
import { V5_API_URL } from '@/globals';

jest.mock('@/invoke/apiCall');
jest.mock('@/hooks/useUserService');

const useUserServiceMock = jest.mocked(useUserService);

jest.mock('swiper/react', () => ({
  Swiper: () => null,
  SwiperSlide: () => null,
}));

jest.mock('swiper/modules', () => ({
  Navigation: () => null,
  Pagination: () => null,
  Autoplay: () => null,
}));

jest.mock('swiper/css', () => jest.fn());
jest.mock('swiper/css/pagination', () => jest.fn());
jest.mock('swiper/css/navigation', () => jest.fn());

describe('User Profile Provider component', () => {
  const mockPlatformAdapter = useMockPlatformAdapter();
  const defaultAmplitudeStore = {
    [FeatureFlags.V5_API_INTEGRATION]: 'on',
    [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'treatment',
  };
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Smoke test', () => {
    it('should render child component without error', () => {
      whenUserProfileProviderComponentIsRendered();

      expect(screen.queryByText('Test Component')).toBeInTheDocument();
    });
  });

  describe('User Profile atom', () => {
    it('should call v5 user endpoint', async () => {
      whenUserProfileProviderComponentIsRendered();

      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith(V5_API_URL.User, {
        method: 'GET',
        queryParameters: {},
        cachePolicy: 'auto',
      });
    });

    it('should not call v5 user endpoint when feature flag disabled', async () => {
      whenUserProfileProviderComponentIsRendered(mockPlatformAdapter, {
        [FeatureFlags.V5_API_INTEGRATION]: 'off',
        [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'treatment',
      });

      expect(mockPlatformAdapter.invokeV5Api).not.toHaveBeenCalled();
    });

    it('should not call v5 user endpoint when category search experiment is control', async () => {
      whenUserProfileProviderComponentIsRendered(mockPlatformAdapter, {
        [FeatureFlags.V5_API_INTEGRATION]: 'on',
        [Experiments.CATEGORY_LEVEL_THREE_SEARCH]: 'control',
      });

      expect(mockPlatformAdapter.invokeV5Api).not.toHaveBeenCalled();
    });

    it('should not set user profile when no user service received from api', async () => {
      const { result } = renderHook(() => useAtom(userProfile));

      whenUserProfileProviderComponentIsRendered();

      expect(result.current[0]).toBeUndefined();
    });

    it('should set user service when user service received from api', async () => {
      const serviceValue = 'serviceValue';
      useUserServiceMock.mockReturnValue(serviceValue);
      const { result } = renderHook(() => useAtom(userProfile));

      whenUserProfileProviderComponentIsRendered();

      expect(result.current[0]?.service).toStrictEqual(serviceValue);
    });

    it('should set user profile when user profile received from api', async () => {
      const testUserProfile: UserProfile = {
        firstname: 'string',
        surname: 'string',
        organisation: 'string',
        dob: '1990-01-01',
        service: undefined,
        isAgeGated: true,
      };
      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: {
          profile: testUserProfile,
        },
      });
      const { result } = renderHook(() => useAtom(userProfile));

      whenUserProfileProviderComponentIsRendered(mockPlatformAdapter);

      await waitFor(() => expect(expect(result.current[0]).toStrictEqual(testUserProfile)));
    });

    it('should set age gated value to true for under 18 user', async () => {
      const testUserProfile: UserProfile = {
        firstname: 'string',
        surname: 'string',
        organisation: 'string',
        dob: getUnder18DateOfBirth(),
        service: undefined,
      };
      const mockPlatformAdapter = useMockPlatformAdapter(200, {
        data: {
          profile: testUserProfile,
        },
      });
      const { result } = renderHook(() => useAtom(userProfile));

      whenUserProfileProviderComponentIsRendered(mockPlatformAdapter);

      await waitFor(() =>
        expect(expect(result.current[0]).toStrictEqual({ ...testUserProfile, isAgeGated: false })),
      );
    });
  });
  const whenUserProfileProviderComponentIsRendered = (
    platformAdapter = mockPlatformAdapter,
    amplitudeStore = defaultAmplitudeStore,
  ) => {
    givenAmplitudeStoreSet(amplitudeStore);
    render(
      <PlatformAdapterProvider adapter={platformAdapter}>
        <UserProfileProvider>Test Component</UserProfileProvider>
      </PlatformAdapterProvider>,
    );
  };

  const getUnder18DateOfBirth = () => {
    const dob = new Date();
    dob.setFullYear(new Date().getFullYear() - 16);
    return `${dob.getFullYear()}-${dob.getMonth() + 1}-${dob.getDate()}`;
  };
});

const givenAmplitudeStoreSet = (state: AmplitudeStore) => {
  return renderHook(() => {
    const setAmpStore = useSetAtom(experimentsAndFeatureFlags);
    setAmpStore(state);
  });
};
