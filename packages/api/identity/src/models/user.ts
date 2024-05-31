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
    email_validated: z.number().optional().default(0),
    spare_email: z.string().optional(),
    spare_email_validated: z.number().optional().default(0),
    twoFactorAuthentication: z.boolean().optional().default(false),
  }).transform(user => ({
    ...user,
    spareEmail: user.spare_email,
    spareEmailValidated: user.spare_email_validated,
    emailValidated: user.email_validated,
    dob: transformDateToFormatYYYYMMDD(user.dob)
  })),
);

export type UserModel = z.infer<typeof UserModel>;
