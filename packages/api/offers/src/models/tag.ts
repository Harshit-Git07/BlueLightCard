import { z } from 'zod';

export const TagModel = z.object({
  id: z.string({
    required_error: 'ID is required',
    invalid_type_error: 'ID must be a string',
  }),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  createdAt: z.number({
    required_error: 'createdAt is required',
    invalid_type_error: 'createdAt must be a timestamp',
  }),
  updatedAt: z.number({
    required_error: 'updatedAt is required',
    invalid_type_error: 'updatedAt must be a timestamp',
  }),
});

export type Tag = z.infer<typeof TagModel>;
