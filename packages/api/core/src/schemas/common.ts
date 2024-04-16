import { z } from 'zod';
import { platformEnum } from '@blc-mono/redemptions/libs/database/schema';

export const WELL_KNOWN_PORTS_SCHEMA = z.coerce.number().int().min(1024).max(65535);
export const NON_NEGATIVE_INT = z.number().nonnegative().int();
export const DATE_YYYY_MM_DD_SCHEMA = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const PLATFORM_SCHEMA = z.enum(platformEnum.enumValues)


export const JsonStringSchema = z.string().transform((body, ctx) => {
  try {
    return JSON.parse(body);
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Invalid JSON',
    });
    return z.NEVER;
  }
});

export const CORS_ALLOWED_ORIGINS_SCHEMA = z.array(z.string()).min(1);
