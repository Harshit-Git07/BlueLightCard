import { usePlatformAdapter } from '../../../../adapters';
import { useMutation } from '@tanstack/react-query';
import { jsonOrNull } from '../../../../utils/jsonUtils';

interface Updates {
  email: string;
}

interface PutResponseData {
  error?: string;
}

const useIdVerificationEmailPut = (memberUuid: string) => {
  const adapter = usePlatformAdapter();
  return useMutation({
    mutationFn: async (update: Updates) => {
      const { email } = update;
      try {
        const { status, data } = await adapter.invokeV5Api('/api/v1/email/verify', {
          method: 'PUT',
          body: JSON.stringify({
            email,
            memberUuid,
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

export default useIdVerificationEmailPut;
