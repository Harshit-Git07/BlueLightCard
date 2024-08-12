import { ZodError } from 'zod';
import { Logger } from '@aws-lambda-powertools/logger';

import { Category, CategoryModel } from '../../models/category';
import { filterUndefinedValues } from '../../utils/filters';

const getValidCategoriesReducer = (logger: Logger) =>
  (accumulator: Category[], category: Category) => {
    const formattedCategory = filterUndefinedValues(category);

    try {
      const parsedCategory = CategoryModel.parse(formattedCategory)
      accumulator.push(parsedCategory)
    } catch (err) {
      logger.error('Invalid category: ', category);

      if (err instanceof ZodError) {
        logger.error(err.message);
      }
    }

    return accumulator;
  };

export default getValidCategoriesReducer;
