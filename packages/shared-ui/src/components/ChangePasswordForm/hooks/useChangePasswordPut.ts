import { usePlatformAdapter } from '../../../adapters';
import { useMutation } from '@tanstack/react-query';
import { V5_API_URL } from 'client/src/common/globals/apiUrl';
import { UpdatePasswordPayload, UpdatePasswordResponse } from '../types';
import { jsonOrNull } from '../../../utils/jsonUtils';
import { ApiResponseError, ApiResponseSuccess } from '../../../api/types';

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
            ...jsonOrNull<ApiResponseSuccess>(data),
          }
        : {
            type: 'error',
            ...jsonOrNull<ApiResponseError>(data),
          };
    },
  });
};
