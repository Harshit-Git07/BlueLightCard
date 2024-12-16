import { usePlatformAdapter } from '../../adapters';
import { useMutation } from '@tanstack/react-query';
import { jsonOrNull } from '../../utils/jsonUtils';
import { V5_API_URL } from '@/constants';

interface Updates {
  email: string;
}

interface PutResponseData {
  error?: string;
}

const useChangeEmailAddressPut = (memberId: string) => {
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (update: Updates) => {
      const { email } = update;
      try {
        const { status, data } = await adapter.invokeV5Api(
          `${V5_API_URL.Profile(memberId)}/email`,
          {
            method: 'PUT',
            body: JSON.stringify({
              newEmail: email,
            }),
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
