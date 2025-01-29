import { z } from 'zod';

import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const EmailPayloadSchema = z.object({
  email: z.string(),
  newEmail: z.string().optional(),
  workEmail: z.string().optional(),
  subject: z.string(),
  content: z.object({
    F_Name: z.string(),
    Link: z.string().optional(),
    Link2: z.string().optional(),
    Link3: z.string().optional(),
    Link4: z.string().optional(),
  }),
});
export type EmailPayload = z.infer<typeof EmailPayloadSchema>;

export const EmailModel = createZodNamedType(
  'EmailModel',
  z.object({
    emailType: z.string(),
    payload: EmailPayloadSchema,
  }),
);
export type EmailModel = z.infer<typeof EmailModel>;
