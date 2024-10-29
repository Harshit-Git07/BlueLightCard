import { EventBridgeEvent } from 'aws-lambda';
import { z } from 'zod';

type EventBridgeEventShape = {
  [key in keyof EventBridgeEvent<string, unknown>]: unknown;
};

type DetailTypeConstraint = z.ZodEnum<[string, ...string[]]> | z.ZodString | z.ZodLiteral<string>;
export function eventSchema<DetailType extends DetailTypeConstraint, Detail extends z.AnyZodObject>(
  source: string | { prefix: string },
  eventDetailType: DetailType,
  detail: Detail,
) {
  return z.object({
    account: z.string(),
    detail: detail,
    'detail-type': eventDetailType,
    id: z.string(),
    region: z.string(),
    resources: z.array(z.string()),
    source: z.string().refine(
      (s) => typeof source === "string" ? s === source: s.startsWith(source.prefix),
      (s) => ({ message: `Unexpected event source (${s}), expected ${source}` }),
    ),
    time: z.string().datetime(),
    version: z.string(),
  } satisfies EventBridgeEventShape);
}

export type EventSchema<
  DetailType extends DetailTypeConstraint,
  Detail extends z.AnyZodObject = z.AnyZodObject,
> = ReturnType<typeof eventSchema<DetailType, Detail>>;
