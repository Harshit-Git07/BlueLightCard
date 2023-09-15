import {z} from 'zod';

export const RedemptionModel = z.object({
    id: z.string().optional(),
    name: z.string()
});

(RedemptionModel as any)._ModelName = 'RedemptionModel'

export type RedemptionModel = z.infer<typeof RedemptionModel>;