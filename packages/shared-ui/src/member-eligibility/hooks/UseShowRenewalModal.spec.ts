import { renderHook, act } from '@testing-library/react';
import { useMemberProfile } from '../service-layer/member-profile/UseGetMemberProfile';
import { useShowRenewalModal } from './UseShowRenewalModal';
import { IPlatformAdapter, usePlatformAdapter } from '../../adapters';
import { ServiceLayerMemberProfile } from '@/member-eligibility/service-layer/member-profile/types/ServiceLayerMemberProfile';

jest.mock('../../adapters', () => ({
  usePlatformAdapter: jest.fn(),
}));
jest.mock('../service-layer/member-profile/UseGetMemberProfile');

const platformAdapterMock = jest.mocked(usePlatformAdapter);
const useMemberProfileMock = jest.mocked(useMemberProfile);

beforeEach(() => {
  platformAdapterMock.mockReturnValue({
    getAmplitudeFeatureFlag: jest.fn().mockReturnValue('on'),
  } as unknown as IPlatformAdapter);
});

it('does not show modal when modern-eligibility-enabled is off', () => {
  platformAdapterMock.mockReturnValue({
    getAmplitudeFeatureFlag: jest.fn().mockReturnValue('off'),
  } as unknown as IPlatformAdapter);

  const { result } = renderHook(() => useShowRenewalModal());

  expect(result.current.shouldShowRenewalModal).toBe(false);
  expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
});

it('does not show modal when member profile is undefined', () => {
  useMemberProfileMock.mockReturnValue(undefined);

  const { result } = renderHook(() => useShowRenewalModal());

  expect(result.current.shouldShowRenewalModal).toBe(false);
  expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
});

it('shows modal when card is expired 31 days ago and returns ifCardExpiredMoreThan30Days as true (hiding later button)', () => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 31);

  useMemberProfileMock.mockReturnValue({
    cards: [{ expiryDate: expiredDate.toISOString() }],
  } as ServiceLayerMemberProfile);

  const { result } = renderHook(() => useShowRenewalModal());

  expect(result.current.shouldShowRenewalModal).toBe(true);
  expect(result.current.ifCardExpiredMoreThan30Days).toBe(true);
});

it('hides the renewal modal when onHideRenewalModal is called', () => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 15);

  useMemberProfileMock.mockReturnValue({
    cards: [{ expiryDate: expiredDate.toISOString() }],
  } as ServiceLayerMemberProfile);

  const { result } = renderHook(() => useShowRenewalModal());

  act(() => {
    result.current.onHideRenewalModal();
  });

  expect(result.current.shouldShowRenewalModal).toBe(false);
});
