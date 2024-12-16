import { usePlatformAdapter } from '../../adapters';
import { useMutation } from '@tanstack/react-query';
import { UpdatePasswordPayload, UpdatePasswordResponse } from './types';
import { V5_API_URL } from '../../constants';

export type ApiMessage = {
  code: string;
  detail: string;
  source?: string;
};

export type UpdatePasswordSuccessApiResponse = {
  messages: Array<ApiMessage>;
  requestId: string;
};

export type UpdatePasswordErrorApiResponse = {
  errors: Array<ApiMessage>;
};

export const useChangePasswordPut = (memberUuid: string) => {
  const platformAdapter = usePlatformAdapter();

  return useMutation({
    mutationFn: async (putBody: UpdatePasswordPayload): Promise<UpdatePasswordResponse> => {
      const { status, data } = await platformAdapter.invokeV5Api(
        `${V5_API_URL.User}/${memberUuid}`,
        {
          method: 'PUT',
          body: JSON.stringify(putBody),
        },
      );

      return status < 400
        ? {
            type: 'success',
            ...safeJsonParse<UpdatePasswordSuccessApiResponse>(data),
          }
        : {
            type: 'error',
            ...safeJsonParse<UpdatePasswordErrorApiResponse>(data),
          };
    },
  });
};

// will merge with stu's
export const safeJsonParse = <T extends object>(jsonString: string = '') => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return null;
  }
};
