import { render, renderHook, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { useAtom } from 'jotai';
import UserServiceProvider from '@/components/UserServiceProvider/UserServiceProvider';
import { APIUrl } from '@/globals';
import { userService } from '@/components/UserServiceProvider/store';
import useUserService from '@/hooks/useUserService';

jest.mock('@/invoke/apiCall');
jest.mock('@/hooks/useUserService');

const useUserServiceMock = jest.mocked(useUserService);

describe('User Service Provider component', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Smoke test', () => {
    it('should render child component without error', () => {
      whenUserServiceProviderComponentIsRendered();

      expect(screen.queryByText('Test Component')).toBeInTheDocument();
    });
  });

  describe('User Service atom', () => {
    it('should call for user service', async () => {
      const requestDataMock = jest
        .spyOn(InvokeNativeAPICall.prototype, 'requestData')
        .mockImplementation(() => jest.fn());

      whenUserServiceProviderComponentIsRendered();

      expect(requestDataMock).toHaveBeenCalledWith(APIUrl.UserService);
    });

    it('should not set user service atom when no user service received from api', async () => {
      const serviceValue = undefined;
      useUserServiceMock.mockReturnValue(serviceValue);
      const { result } = renderHook(() => useAtom(userService));

      whenUserServiceProviderComponentIsRendered();

      expect(result.current[0]).toStrictEqual(serviceValue);
    });

    it('should set user service atom when user service received from api', async () => {
      const serviceValue = 'Service';
      useUserServiceMock.mockReturnValue(serviceValue);
      const { result } = renderHook(() => useAtom(userService));

      whenUserServiceProviderComponentIsRendered();

      expect(result.current[0]).toStrictEqual(serviceValue);
    });
  });
});

const whenUserServiceProviderComponentIsRendered = () => {
  render(<UserServiceProvider>Test Component</UserServiceProvider>);
};
