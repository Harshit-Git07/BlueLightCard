import { z } from 'zod';
import { validateBrand } from "../utils/validation";

export const BrandModel = z.object({
  id: z
    .string({ required_error: 'Brand ID is required', invalid_type_error: 'Brand ID must be a string' })
    .refine((val) => validateBrand(val), { message: 'Brand ID is not valid' }),
  name: z.string().optional(),
});

export type Brand = z.infer<typeof BrandModel>;
