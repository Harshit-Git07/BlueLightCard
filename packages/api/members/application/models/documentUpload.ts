import { z } from 'zod';
import { createZodNamedType } from '@blc-mono/core/extensions/apiGatewayExtension/agModelGenerator';

export const DocumentUploadLocation = createZodNamedType(
  'DocumentUploadLocation',
  z.object({
    preSignedUrl: z.string(),
    documentId: z.string(),
  }),
);

export type DocumentUploadLocation = z.infer<typeof DocumentUploadLocation>;

export const DocumentListPresignedUrl = createZodNamedType(
  'DocumentListPresignedUrl',
  z.object({ documents: z.array(z.string()) }),
);

export type DocumentListPresignedUrl = z.infer<typeof DocumentListPresignedUrl>;
