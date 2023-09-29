import {z} from 'zod';

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
    spareEmailValidated: z.string().optional(),
    twoFactorAuthentication: z.boolean().optional().default(false),
  });

(UserModel as any)._ModelName = 'UserModel'

export type UserModel = z.infer<typeof UserModel>;