import AmplitudeContext from '@/root/src/common/context/AmplitudeContext';
import UserContext, { UserContextType } from '@/root/src/common/context/User/UserContext';
import { Amplitude } from '@/root/src/common/utils/amplitude/amplitude';
import { act, renderHook } from '@testing-library/react';
import { useNavigationTracking } from '../../../Navigation/NavBarV2/hooks/useNavigationTracking';
import * as amplitude from '@amplitude/analytics-browser';

describe('useNavigationTracking', () => {
  const mockSetUserId = jest.fn();
  const mockTrackEventAsync = jest.fn(() => Promise.resolve({} as amplitude.Types.Result));
  const mockAmplitudeValue: Amplitude = {
    setUserId: mockSetUserId,
    isInitialised: false,
    initialise: jest.fn(),
    setSessionId: jest.fn(),
    _isAmplitudeInitialised: jest.fn(),
    trackEventAsync: mockTrackEventAsync,
    trackEvent: jest.fn(),
  };

  const mockUserContext: UserContextType = {
    dislikes: [],
    user: {
      companies_follows: [],
      legacyId: 'mock-legacy-id',
      profile: {
        dob: '12-12-2001',
        organisation: 'mock-org',
      },
      uuid: 'mock-user-uuid',
    },
    setUser: jest.fn(),
    error: undefined,
    isAgeGated: false,
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AmplitudeContext.Provider value={mockAmplitudeValue}>
      <UserContext.Provider value={mockUserContext}>{children}</UserContext.Provider>
    </AmplitudeContext.Provider>
  );
  const mockButtonID = 'mock-button-id';
  it('should log the event with amplitude successfully', () => {
    const { result } = renderHook(() => useNavigationTracking(), { wrapper });
    act(() => {
      result.current.trackNavigationEvent(mockButtonID);
    });
    expect(mockSetUserId).toHaveBeenCalledWith(mockUserContext.user?.uuid);
    expect(mockTrackEventAsync).toHaveBeenCalledWith('navigation_clicked', {
      menuItem: mockButtonID,
    });
  });
});
