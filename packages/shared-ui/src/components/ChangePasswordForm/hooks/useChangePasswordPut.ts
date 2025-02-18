import { usePlatformAdapter } from '../../../adapters';
import { useMutation } from '@tanstack/react-query';
import { UpdatePasswordPayload, UpdatePasswordResponse } from '../types';
import { jsonOrNull } from '../../../utils/jsonUtils';
import { ApiResponseError, ApiResponseSuccess } from '../../../api/types';
import { V5_API_URL } from '../../../constants';
import useMemberId from '../../../hooks/useMemberId';

export const useChangePasswordPut = () => {
  const platformAdapter = usePlatformAdapter();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: async (putBody: UpdatePasswordPayload): Promise<UpdatePasswordResponse> => {
      const { status, data } = await platformAdapter.invokeV5Api(
        `${V5_API_URL.Profile(memberId)}/password`,
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
