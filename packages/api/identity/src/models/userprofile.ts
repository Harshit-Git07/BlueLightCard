import {z} from 'zod';

export const UserProfileModel = z.object({
    dob: z.string().nullish(),
    employer: z.string().optional(),
    employer_id: z.string().optional(),
    firstname: z.string().optional(),
    ga_key: z.string().nullish(),
    gender: z.string().nullish(),
    merged_time: z.string().nullish(),
    merged_uid: z.preprocess((a) => typeof a === 'string' ? parseInt(a, 10) : a, z.number()).nullish().optional(),
    mobile: z.string().nullish(),
    organisation: z.string().optional(),
    email: z.string().nullish(),
    email_validated: z.number().nullish(),
    spare_email: z.string().nullish(),
    spare_email_validated: z.preprocess((a) => {
      if (a === "" || a === undefined) {
        return 0;
      } else if (typeof a === 'string') {
        return parseInt(a, 10);
      } else {
        return a;
      }
    }, z.number()).nullable().optional(),
    surname: z.string().optional()
}).strict();

(UserProfileModel as any)._ModelName = 'UserProfileModel'

export type UserProfile = z.infer<typeof UserProfileModel>;
