import { z } from "zod";

export const CategoryModel = z.object({
  id: z.string({
    required_error: 'ID is required',
    invalid_type_error: 'ID must be a string',
  }),
  legacyId: z.string({
    required_error: 'Legacy ID is required',
    invalid_type_error: 'Legacy ID must be a string',
  }),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  type: z.string({
    required_error: 'Type is required',
    invalid_type_error: 'Type must be a string',
  }),
  parentCategoryId: z.string({
    invalid_type_error: 'Parent Category ID must be a string',
  }).optional(),
  description: z.string({
    invalid_type_error: 'Description must be a string',
  }).optional(),
  imageThumb: z.string({
    invalid_type_error: 'Image Thumb must be a string',
  }).optional(),
});

export type Category = z.infer<typeof CategoryModel>;