import {z} from 'zod';

export const UserProfileModel = z.object({
    dob: z.string().optional(),
    employer: z.string().optional(),
    employer_id: z.string().optional(),
    firstname: z.string().optional(),
    ga_key: z.string().optional(),
    gender: z.string().optional(),
    merged_time: z.string().optional(),
    merged_uid: z.boolean().optional(),
    mobile: z.string().optional(),
    organisation: z.string().optional(),
    spare_email: z.string().optional(),
    spare_email_validated: z.number().optional(),
    surname: z.string().optional()
}).strict();

(UserProfileModel as any)._ModelName = 'UserProfileModel'

export type UserProfile = z.infer<typeof UserProfileModel>;