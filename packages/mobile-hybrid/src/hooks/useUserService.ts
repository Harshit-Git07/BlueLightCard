import useAPI, { APIResponse } from './useAPI';
import { APIUrl } from '@/globals';

export interface IUserService {
  service: string;
  tid: number;
}

const useUserService = (): string | undefined => {
  const response = useAPI(APIUrl.UserService) as APIResponse<IUserService>;
  return response?.data?.service;
};

export default useUserService;
