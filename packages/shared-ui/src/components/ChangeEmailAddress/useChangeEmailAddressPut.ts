import { usePlatformAdapter } from '../../adapters';
import { useMutation } from '@tanstack/react-query';
import { jsonOrNull } from '../../utils/jsonUtils';

interface Updates {
  email: string;
  action: 'resend' | 'change';
}

interface PutResponseData {
  error?: string;
}

const useChangeEmailAddressPut = (memberUuid: string) => {
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (update: Updates) => {
      const { email, action } = update;
      try {
        const { status, data } = await adapter.invokeV5Api('/api/v1/email/update', {
          method: 'PUT',
          body: JSON.stringify({
            email,
            memberUuid,
            action,
          }),
        });

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
