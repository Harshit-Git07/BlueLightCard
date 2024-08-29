import { z } from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { usePlatformAdapter } from '../index';

const userResponseModel = z.object({
  message: z.string(),
  data: z.object({
    profile: z.object({
      firstname: z.string().nullable(),
      surname: z.string().nullable(),
      organisation: z.string().nullable(),
      dob: z.string(),
      gender: z.string().nullable(),
      mobile: z.string().nullable(),
      email: z.string().nullable(),
      emailValidated: z.number().nullable(),
      spareEmail: z.string().nullable(),
      spareEmailValidated: z.number().nullable(),
      twoFactorAuthentication: z.boolean().nullable(),
    }),
    cards: z.array(
      z.object({
        cardId: z.string().nullable(),
        expires: z.string().nullable(),
        cardStatus: z.string().nullable(),
        datePosted: z.string().nullable(),
      }),
    ),
    companies_follows: z.array(z.unknown()),
    canRedeemOffer: z.boolean().nullable(),
  }),
});

export function userQuery() {
  const platformAdapter = usePlatformAdapter();

  return queryOptions({
    queryKey: ['user'],
    queryFn: async () => {
      const result = await platformAdapter.invokeV5Api('/eu/identity/user', {
        method: 'GET',
      });

      return userResponseModel.parse(JSON.parse(result.data)).data;
    },
  });
}
