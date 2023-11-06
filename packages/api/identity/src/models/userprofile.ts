import {z} from 'zod';

export const UserProfileModel = z.object({
    dob: z.string().nullish(),
    employer: z.string().optional(),
    employer_id: z.string().optional(),
    firstname: z.string().optional(),
    ga_key: z.string().nullish(),
    gender: z.string().nullish(),
    merged_time: z.string().nullish(),
    merged_uid: z.boolean().nullish(),
    mobile: z.string().nullish(),
    organisation: z.string().optional(),
    spare_email: z.string().nullish(),
    spare_email_validated: z.number().nullish(),
    surname: z.string().optional()
}).strict();

(UserProfileModel as any)._ModelName = 'UserProfileModel'

export type UserProfile = z.infer<typeof UserProfileModel>;