import { useMutation } from '@tanstack/react-query';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { jsonOrNull } from '@bluelightcard/shared-ui/utils/jsonUtils';
import { ApiResponseError } from '@bluelightcard/shared-ui/api/types';

export interface ValidateEmailRequest {
  emailType: string;
  emailPayload: string;
}

export interface ValidateEmailResponse {
  messages: {
    code: string;
    detail: string;
  }[];
  requestId: string;
}

const useValidateEmailPost = () => {
  const adapter = usePlatformAdapter();

  return useMutation({
    mutationFn: async (request: ValidateEmailRequest): Promise<any> => {
      const { status, data } = await adapter.invokeV5Api(`/members/emailhandler`, {
        method: 'POST',
        body: JSON.stringify(request),
      });

      if (status !== 200) throw new Error('Failed to verify email address');

      return jsonOrNull<ApiResponseError>(data);
    },
  });
};

export default useValidateEmailPost;
