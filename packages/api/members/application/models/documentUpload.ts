import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const DocumentUploadLocation = createZodNamedType(
  'DocumentUploadLocation',
  z.object({
    preSignedUrl: z.string(),
  }),
);
export type DocumentUploadLocation = z.infer<typeof DocumentUploadLocation>;
