import {z} from 'zod';
import { transformDateToFormatYYYYMMDD } from '../../../core/src/utils/date';

export const UserModel = z.object({
    firstname: z.string(),
    surname: z.string(),
    organisation: z.string(),
    dob: z.string(),
    gender: z.string(),
    mobile: z.string(),
    uuid: z.string().optional(),
    service: z.string().optional(),
    spareEmail: z.string().optional(),
    spareEmailValidated: z.number().optional().default(0),
    twoFactorAuthentication: z.boolean().optional().default(false),
  }).transform(user => ({
    ...user,
    dob: transformDateToFormatYYYYMMDD(user.dob)
  }));

(UserModel as any)._ModelName = 'UserModel'

export type UserModel = z.infer<typeof UserModel>;