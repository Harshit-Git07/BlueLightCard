import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const NoteModel = createZodNamedType(
  'NoteModel',
  z.object({
    timestamp: z.string().default(new Date().toISOString()).optional(),
    message: z.string(),
    source: z.string().optional(),
    category: z.string().optional(),
    pinned: z.boolean().default(false).optional(),
  }),
);

export type NoteModel = z.infer<typeof NoteModel>;
