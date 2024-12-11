import { renderHook, waitFor } from '@testing-library/react';
import { usePersonalDetailsState } from './usePersonalDetailsState';
import { customerProfileNoCardMock } from '../../../mocks';
import { act } from 'react';
import moment from 'moment/moment';

const mockUseMemberId = jest.fn().mockReturnValue('abcd-1234');
jest.mock('../../../hooks/useMemberId', () => ({
  __esModule: true,
  default: () => mockUseMemberId(),
}));

const mockUseMemberProfileGet = jest.fn();
jest.mock('../../../hooks/useMemberProfileGet', () => ({
  __esModule: true,
  default: () => mockUseMemberProfileGet(),
}));

const mockMutationFunction = jest.fn();
jest.mock('./useMemberProfilePut', () => ({
  useMemberProfilePut: () => ({ mutateAsync: mockMutationFunction }),
}));

const mockGetEmployers = jest.fn().mockReturnValue({ isLoading: true });
jest.mock('../../../hooks/useGetEmployers', () => ({
  useGetEmployers: () => mockGetEmployers(),
}));

describe('usePersonalDetailsState', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns expected state initially', async () => {
    mockUseMemberProfileGet.mockReturnValue({ isLoading: true });
    const { result } = renderHook(() => usePersonalDetailsState());

    expect(result.current.saveButtonDisabled).toEqual(true);
  });

  it('loads data from customer profile', async () => {
    mockUseMemberProfileGet.mockReturnValue({
      isLoading: false,
      data: { data: customerProfileNoCardMock },
      memberProfile: customerProfileNoCardMock,
    });
    const { result } = renderHook(() => usePersonalDetailsState());

    expect(result.current.saveButtonDisabled).toEqual(true);
    await waitFor(() =>
      expect(result.current.formState.dateOfBirth.value).toEqual(
        new Date(customerProfileNoCardMock.dateOfBirth),
      ),
    );
  });

  it('updates fields correctly', async () => {
    const { result } = renderHook(() => usePersonalDetailsState());

    await act(async () => result.current.updateFormValue('region', 'newRegion'));

    expect(result.current.saveButtonDisabled).toBe(false);
    await waitFor(() => expect(result.current.formState.region.value).toEqual('newRegion'));
  });

  describe('transforms data for the api correctly', () => {
    it('by default', async () => {
      mockUseMemberProfileGet.mockReturnValue({
        isLoading: false,
        data: { data: customerProfileNoCardMock },
        memberProfile: customerProfileNoCardMock,
      });
      const { result } = renderHook(() => usePersonalDetailsState());

      await result.current.makeApiRequest();

      const mutationFnLastCall = mockMutationFunction.mock.lastCall;
      const lastCallFirstArg = mutationFnLastCall[0];

      expect(lastCallFirstArg.firstName).toEqual(customerProfileNoCardMock.firstName);
      expect(lastCallFirstArg.lastName).toEqual(customerProfileNoCardMock.lastName);
      expect(
        moment(lastCallFirstArg.dateOfBirth).isSame(moment(customerProfileNoCardMock.dateOfBirth)),
      ).toBeTruthy();
    });
  });
});
