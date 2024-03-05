import { FC, PropsWithChildren, useEffect } from 'react';
import { userService } from './store';
import { useSetAtom } from 'jotai';
import InvokeNativeAPICall from '@/invoke/apiCall';
import { APIUrl } from '@/globals';
import useUserService from '@/hooks/useUserService';

const invokeNativeAPICall = new InvokeNativeAPICall();

const UserServiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const setUserService = useSetAtom(userService);
  const userServiceValue = useUserService();

  useEffect(() => {
    invokeNativeAPICall.requestData(APIUrl.UserService);
  }, []);

  useEffect(() => {
    if (userServiceValue) {
      setUserService(userServiceValue);
    }
  }, [userServiceValue, setUserService]);

  return children;
};

export default UserServiceProvider;
