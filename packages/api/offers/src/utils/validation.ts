import { BLC_AUS, BLC_UK, DDS_UK } from './global-constants';
import { Logger } from "@aws-lambda-powertools/logger";
import {
  OfferRestrictionQueryInput,
  OfferRestrictionQueryInputModel
} from "../models/queries-input/offerRestrictionQueryInput";

export function validateBrand(brandId: string) {
  return !(!brandId || ![BLC_UK, BLC_AUS, DDS_UK].includes(brandId));
}

export function validateOfferRestrictionInput(payload: any, logger: Logger) {
  const result = OfferRestrictionQueryInputModel.safeParse(payload);
  if (result.success) {
    return payload as OfferRestrictionQueryInput;
  }else{
    logger.error(`Error validating homepage query input ${result.error}`);
    throw new Error(`Error validating homepage query input ${result.error}`);
  }
}
