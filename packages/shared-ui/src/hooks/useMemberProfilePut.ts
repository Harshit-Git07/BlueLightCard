import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePlatformAdapter } from '../adapters';
import { ProfileSchema } from '../components/CardVerificationAlerts/types';
import { V5_API_URL } from '../constants';
import { useMemberProfileGet } from './useMemberProfileGet';

const useMemberProfilePut = () => {
  const queryClient = useQueryClient();
  const adapter = usePlatformAdapter();

  const { memberProfile } = useMemberProfileGet();
  const memberId = memberProfile?.memberId ?? '';

  const fieldsRequiredForPut = {
    firstName: memberProfile?.firstName,
    lastName: memberProfile?.lastName,
    dateOfBirth: memberProfile?.dateOfBirth,
  };

  return useMutation({
    mutationFn: async (updates: Partial<ProfileSchema>) => {
      try {
        const { status } = await adapter.invokeV5Api(V5_API_URL.Profile(memberId), {
          method: 'PUT',
          body: JSON.stringify({
            ...fieldsRequiredForPut,
            ...updates,
            memberId,
          }),
        });

        return {
          status,
          data: {},
        };
      } catch (err) {
        return {
          status: 500,
          data: { error: 'Unknown error occurred' },
        };
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['memberProfile', memberId] });
    },
  });
};

export default useMemberProfilePut;
