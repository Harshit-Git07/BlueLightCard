import { renderHook, act } from '@testing-library/react';
import { useShowRenewalModal } from '@/root/src/member-eligibility/hooks/UseShowRenewalModal';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { useMemberProfile } from '@/root/src/member-eligibility/service-layer/member-profile/UseGetMemberProfile';

jest.mock('@/context/AmplitudeExperiment');
jest.mock('@/root/src/member-eligibility/service-layer/member-profile/UseGetMemberProfile');

const mockUseAmplitudeExperiment = useAmplitudeExperiment as jest.Mock;
const mockUseMemberProfile = useMemberProfile as jest.Mock;

describe('useShowRenewalModal', () => {
  beforeEach(() => {
    mockUseAmplitudeExperiment.mockReturnValue({ data: { variantName: 'on' } });
  });

  it('does not show modal when modern-eligibility-enabled is off', () => {
    mockUseAmplitudeExperiment.mockReturnValue({ data: { variantName: 'off' } });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('does not show modal when member profile returns undefined', () => {
    mockUseMemberProfile.mockReturnValue(undefined);

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('does not show modal when member profile returns an empty object', () => {
    mockUseMemberProfile.mockReturnValue({ cards: [] });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('does not show modal when cards array is empty', () => {
    mockUseMemberProfile.mockReturnValue({ cards: [] });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when latest card is expired but within 15 days and returns ifCardExpiredMoreThan30Days as false', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 15);

    mockUseMemberProfile.mockReturnValue({
      cards: [
        { expiryDate: new Date('2020-01-01').toISOString() },
        { expiryDate: expiredDate.toISOString() },
      ],
    });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when latest card is expired but within 29 days and returns ifCardExpiredMoreThan30Days as false', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 29);

    mockUseMemberProfile.mockReturnValue({
      cards: [
        { expiryDate: new Date('2020-01-01').toISOString() },
        { expiryDate: expiredDate.toISOString() },
      ],
    });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when latest card is expired 30 days ago and returns ifCardExpiredMoreThan30Days as false', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 30);

    mockUseMemberProfile.mockReturnValue({
      cards: [
        { expiryDate: new Date('2020-01-01').toISOString() },
        { expiryDate: expiredDate.toISOString() },
      ],
    });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when latest card is expired 31 days ago and returns ifCardExpiredMoreThan30Days as true', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 31);

    mockUseMemberProfile.mockReturnValue({
      cards: [
        { expiryDate: new Date('2020-01-01').toISOString() },
        { expiryDate: expiredDate.toISOString() },
      ],
    });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(true);
  });

  it('shows modal when latest card is expired 90 days ago and returns ifCardExpiredMoreThan30Days as true', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 90);

    mockUseMemberProfile.mockReturnValue({
      cards: [
        { expiryDate: new Date('2020-01-01').toISOString() },
        { expiryDate: expiredDate.toISOString() },
      ],
    });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(true);
  });

  it('does not show modal when latest card is not expired', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);

    mockUseMemberProfile.mockReturnValue({
      cards: [
        { expiryDate: new Date('2020-01-01').toISOString() },
        { expiryDate: futureDate.toISOString() },
      ],
    });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('hides the renewal modal when onHideRenewalModal is called', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 15);

    mockUseMemberProfile.mockReturnValue({
      cards: [
        { expiryDate: new Date('2020-01-01').toISOString() },
        { expiryDate: expiredDate.toISOString() },
      ],
    });

    const { result } = renderHook(() => useShowRenewalModal());

    act(() => {
      result.current.onHideRenewalModal();
    });

    expect(result.current.shouldShowRenewalModal).toBe(false);
  });
});
