import { ZodError } from 'zod';
import { Logger } from '@aws-lambda-powertools/logger';

import { filterUndefinedValuesIgnoreZero } from '../../utils/filters';
import { OfferType, OfferTypeModel } from '../../models/offerType';

const getValidOfferTypeReducer = (logger: Logger) => (accumulator: OfferType[], offerType: OfferType) => {
  const formattedOfferType = filterUndefinedValuesIgnoreZero(offerType);

  try {
    const parsedOfferType = OfferTypeModel.parse(formattedOfferType);
    accumulator.push(parsedOfferType);
  } catch (err) {
    logger.error('Invalid offerType: ', offerType);

    if (err instanceof ZodError) {
      logger.error(err.message);
    }
  }

  return accumulator;
};

export default getValidOfferTypeReducer;
