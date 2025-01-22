import { z } from 'zod';
import { NoteSource } from './enums/NoteSource';
import { createZodNamedType } from '@blc-mono/shared/utils/zodNamedType';

export const NoteModel = createZodNamedType(
  'NoteModel',
  z.object({
    noteId: z.string().uuid(),
    text: z.string(),
    source: z.nativeEnum(NoteSource).default(NoteSource.SYSTEM).optional(),
    category: z.string().optional(),
    pinned: z.boolean().default(false).optional(),
    creator: z.string().optional(),
    created: z.string().default(new Date().toISOString()).optional(),
    lastUpdated: z.string().default(new Date().toISOString()).optional(),
  }),
);

export type NoteModel = z.infer<typeof NoteModel>;

export const CreateNoteModel = createZodNamedType(
  'CreateNoteModel',
  NoteModel.omit({
    noteId: true,
    created: true,
    lastUpdated: true,
  }),
);
export type CreateNoteModel = z.infer<typeof CreateNoteModel>;

export const CreateNoteModelResponse = createZodNamedType(
  'CreateNoteModelResponse',
  z.object({
    noteId: z.string().uuid(),
  }),
);
export type CreateNoteModelResponse = z.infer<typeof CreateNoteModelResponse>;

export const UpdateNoteModel = createZodNamedType(
  'UpdateNoteModel',
  NoteModel.omit({
    noteId: true,
    created: true,
    lastUpdated: true,
  }),
);
export type UpdateNoteModel = z.infer<typeof UpdateNoteModel>;
