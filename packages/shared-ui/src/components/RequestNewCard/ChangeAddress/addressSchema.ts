import { z } from 'zod';

export const addressSchema = z
  .object({
    address1: z.string().min(1, 'The Address line 1 is required.'),
    address2: z.string().optional(),
    county: z.string().min(1, 'Choose a County/Suburb is required.'),
    city: z.string().min(1, 'The Town/City is required.'),
    postcode: z.string().min(1, 'The postcode is required.'),
    country: z.string().min(1, 'Choose a Country is required.'),
  })
  .superRefine((data, ctx) => {
    const { postcode, country } = data;
    const message = 'The postcode you entered is not valid. Please try again.';

    if (country === 'United Kingdom') {
      // UK postcode regex: Matches formats like "SW1A 1AA"
      const ukPostcodePattern = /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i;
      if (!ukPostcodePattern.test(postcode)) {
        ctx.addIssue({
          path: ['postcode'],
          message: message,
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (country === 'Australia') {
      // Australian postcode regex: 4 digits
      const auPostcodePattern = /^\d{4}$/;
      if (!auPostcodePattern.test(postcode)) {
        ctx.addIssue({
          path: ['postcode'],
          message: message,
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
