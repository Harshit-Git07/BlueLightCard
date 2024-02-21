import { z } from 'zod';

export function eventSchema<Detail extends z.AnyZodObject>(source: string, detail: Detail) {
  return z.object({
    account: z.string(),
    detail: detail,
    'detail-type': z.string(),
    id: z.string(),
    region: z.string(),
    resources: z.array(z.string()),
    source: z.string().refine(
      (s) => s === source,
      (s) => ({ message: `Unexpected event source (${s}), expected ${source}` }),
    ),
    time: z.string().datetime(),
    version: z.string(),
  });
}

export type EventSchema<Detail extends z.AnyZodObject = z.AnyZodObject> = ReturnType<typeof eventSchema<Detail>>;
