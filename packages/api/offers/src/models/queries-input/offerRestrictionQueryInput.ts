import { z } from "zod";

export const OfferRestrictionQueryInputModel = z.object({
  isUnder18: z.boolean({
      required_error: "isUnder18 is required",
      invalid_type_error: "isUnder18 must be a boolean",
    }
  ),

  organisation: z.string({
      invalid_type_error: "organisation must be a string",
    }
  ).optional(),

})

export type OfferRestrictionQueryInput = z.infer<typeof OfferRestrictionQueryInputModel>;