import useAPIData from './useAPIData';
import { APIUrl } from '@/globals';

const useUserService = (): string | undefined => {
  return useAPIData(APIUrl.UserService)?.service ?? undefined;
};

export default useUserService;
