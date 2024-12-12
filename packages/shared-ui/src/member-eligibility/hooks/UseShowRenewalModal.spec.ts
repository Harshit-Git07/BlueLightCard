import { renderHook, act } from '@testing-library/react';
import { useMemberProfile } from '../service-layer/member-profile/UseGetMemberProfile';
import { useShowRenewalModal } from './UseShowRenewalModal';
import { usePlatformAdapter } from '../../adapters';

jest.mock('../../adapters', () => ({
  usePlatformAdapter: jest.fn(),
}));
jest.mock('../service-layer/member-profile/UseGetMemberProfile');

const mockPlatformAdapter = usePlatformAdapter as jest.Mock;
const mockUseMemberProfile = useMemberProfile as jest.Mock;

beforeEach(() => {
  mockPlatformAdapter.mockReturnValue({
    getAmplitudeFeatureFlag: jest.fn().mockReturnValue('on'),
  });
});

it('does not show modal when modern-eligibility-enabled is off', () => {
  mockPlatformAdapter.mockReturnValue({
    getAmplitudeFeatureFlag: jest.fn().mockReturnValue('off'),
  });

  const { result } = renderHook(() => useShowRenewalModal());

  expect(result.current.shouldShowRenewalModal).toBe(false);
  expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
});

it('does not show modal when member profile is undefined', () => {
  mockUseMemberProfile.mockReturnValue(undefined);

  const { result } = renderHook(() => useShowRenewalModal());

  expect(result.current.shouldShowRenewalModal).toBe(false);
  expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
});

it('shows modal when card is expired 31 days ago and returns ifCardExpiredMoreThan30Days as true (hiding later button)', () => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 31);

  mockUseMemberProfile.mockReturnValue({ card: { expiryDate: expiredDate.toISOString() } });

  const { result } = renderHook(() => useShowRenewalModal());

  expect(result.current.shouldShowRenewalModal).toBe(true);
  expect(result.current.ifCardExpiredMoreThan30Days).toBe(true);
});

it('hides the renewal modal when onHideRenewalModal is called', () => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 15);

  mockUseMemberProfile.mockReturnValue({ card: { expiryDate: expiredDate.toISOString() } });

  const { result } = renderHook(() => useShowRenewalModal());

  act(() => {
    result.current.onHideRenewalModal();
  });

  expect(result.current.shouldShowRenewalModal).toBe(false);
});
