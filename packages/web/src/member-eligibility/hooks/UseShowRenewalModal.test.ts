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

  it('does not show modal when  member profile returns undefined is not provided', () => {
    mockUseMemberProfile.mockReturnValue(undefined);

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('does not show modal when  member profile returns an empty object provided', () => {
    mockUseMemberProfile.mockReturnValue({});

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('does not show modal when  card expiryDate is not provided', () => {
    mockUseMemberProfile.mockReturnValue({ card: {} });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when card is expired but within 15 days and returns ifCardExpiredMoreThan30Days as false (showing later button on modal, meaning user can delay).', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 15);

    mockUseMemberProfile.mockReturnValue({ card: { expiryDate: expiredDate.toISOString() } });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when card is expired but within 29 days and returns ifCardExpiredMoreThan30Days as false (showing later button on modal, meaning user can delay).', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 29);

    mockUseMemberProfile.mockReturnValue({ card: { expiryDate: expiredDate.toISOString() } });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when card is expired 30 days go and returns ifCardExpiredMoreThan30Days as false (showing later button on modal, meaning user can delay).', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 30);

    mockUseAmplitudeExperiment.mockReturnValue({ data: { variantName: 'on' } });
    mockUseMemberProfile.mockReturnValue({ card: { expiryDate: expiredDate.toISOString() } });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
  });

  it('shows modal when card is expired 31 days ago and returns ifCardExpiredMoreThan30Days as true (hiding later button on modal, meaning user has no choice but to renew).', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 31);

    mockUseMemberProfile.mockReturnValue({ card: { expiryDate: expiredDate.toISOString() } });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(true);
  });

  it('shows modal when card is expired 90 days ago and returns ifCardExpiredMoreThan30Days as true (hiding later button on modal, meaning user has no choice but to renew).', () => {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 90);

    mockUseMemberProfile.mockReturnValue({ card: { expiryDate: expiredDate.toISOString() } });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(true);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(true);
  });

  it('does not show modal when card is not expired and ', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);

    mockUseMemberProfile.mockReturnValue({ card: { expiryDate: futureDate.toISOString() } });

    const { result } = renderHook(() => useShowRenewalModal());

    expect(result.current.shouldShowRenewalModal).toBe(false);
    expect(result.current.ifCardExpiredMoreThan30Days).toBe(false);
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
});
