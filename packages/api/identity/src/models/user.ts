import {z} from 'zod';
import { transformDateToFormatYYYYMMDD } from '../../../core/src/utils/date';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const UserModel = createZodNamedType(
  'UserModel',
  z.object({
    firstname: z.string(),
    surname: z.string(),
    organisation: z.string(),
    dob: z.string().nullable(),
    gender: z.string().nullable(),
    mobile: z.string().nullable(),
    uuid: z.string().optional(),
    service: z.string().optional(),
    email: z.string().optional(),
    emailValidated: z.number().optional().default(0),
    spareEmail: z.string().optional(),
    spareEmailValidated: z.number().optional().default(0),
    twoFactorAuthentication: z.boolean().optional().default(false),
  }).transform(user => ({
    ...user,
    dob: transformDateToFormatYYYYMMDD(user.dob)
  })),
);

export type UserModel = z.infer<typeof UserModel>;
