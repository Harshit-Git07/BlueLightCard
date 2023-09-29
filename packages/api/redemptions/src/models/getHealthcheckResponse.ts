import { z } from 'zod';

export const GetHealthcheckResponse = z.object({
    status: z.string(),
});

(GetHealthcheckResponse as any)._ModelName = 'GetHealthcheckResponse'

export type GetHealthcheckResponse = z.infer<typeof GetHealthcheckResponse>;