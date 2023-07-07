import {z} from 'zod';

export const UserModel = z.object({
    id: z.string().optional(),
    name: z.string(),
    email: z.string(),
    age: z.number().optional()
});

(UserModel as any)._ModelName = 'UserModel'

export type User = z.infer<typeof UserModel>;


