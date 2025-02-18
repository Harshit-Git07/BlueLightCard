import { usePlatformAdapter } from '../../../adapters';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponseError, ApiResponseSuccess } from '../../../api/types';
import { UpdateCustomerProfilePayload, UpdateCustomerProfileResponse } from '../types';
import { jsonOrNull } from '../../../utils/jsonUtils';
import { V5_API_URL } from '../../../constants';
import useMemberId from '../../../hooks/useMemberId';

export const useMemberProfilePut = () => {
  const platformAdapter = usePlatformAdapter();
  const queryClient = useQueryClient();
  const memberId = useMemberId();
  return useMutation({
    mutationFn: async (
      putBody: UpdateCustomerProfilePayload,
    ): Promise<UpdateCustomerProfileResponse> => {
      const { status, data } = await platformAdapter.invokeV5Api(V5_API_URL.Profile(memberId), {
        method: 'PUT',
        body: JSON.stringify(putBody),
      });

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
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['memberProfile', memberId] });
    },
  });
};
