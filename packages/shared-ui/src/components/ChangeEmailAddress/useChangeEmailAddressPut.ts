import { usePlatformAdapter } from '../../adapters';
import { useMutation } from '@tanstack/react-query';
import { jsonOrNull } from '../../utils/jsonUtils';
import { V5_API_URL } from '../../constants';
import { EmailChangeModel } from '@blc-mono/shared/models/members/emailChangeModel';
import useMemberId from '../../hooks/useMemberId';

type PutSchema = EmailChangeModel;

interface PutResponseData {
  error?: string;
}

const useChangeEmailAddressPut = () => {
  const adapter = usePlatformAdapter();
  const memberId = useMemberId();

  return useMutation({
    mutationFn: async (putBody: PutSchema) => {
      try {
        const { status, data } = await adapter.invokeV5Api(
          `${V5_API_URL.Profile(memberId)}/email`,
          {
            method: 'PUT',
            body: JSON.stringify(putBody),
          },
        );

        return {
          status,
          data: jsonOrNull<PutResponseData>(data),
        };
      } catch (err) {
        return {
          status: 500,
          data: { error: 'Unknown error occurred' },
        };
      }
    },
  });
};

export default useChangeEmailAddressPut;
