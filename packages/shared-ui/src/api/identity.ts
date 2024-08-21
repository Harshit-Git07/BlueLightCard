import { z } from 'zod';
import { queryOptions } from '@tanstack/react-query';
import { usePlatformAdapter } from '../index';

const userResponseModel = z.object({
  message: z.string(),
  data: z.object({
    profile: z.object({
      firstname: z.string(),
      surname: z.string(),
      organisation: z.string(),
      dob: z.string(),
      gender: z.string(),
      mobile: z.string(),
      email: z.string().optional(),
      emailValidated: z.number(),
      spareEmail: z.string(),
      spareEmailValidated: z.number(),
      twoFactorAuthentication: z.boolean(),
    }),
    cards: z.array(
      z.object({
        cardId: z.string(),
        expires: z.string(),
        cardStatus: z.string(),
        datePosted: z.string().nullable(),
      }),
    ),
    companies_follows: z.array(z.unknown()),
    canRedeemOffer: z.boolean(),
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
