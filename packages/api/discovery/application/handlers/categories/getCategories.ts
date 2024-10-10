import 'dd-trace/init';

import { datadog } from 'datadog-lambda-js';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { SimpleCategory } from '@blc-mono/discovery/application/models/SimpleCategory';
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'categories-get' });

const handlerUnwrapped = async () => {
  logger.info({ message: `Getting categories` });
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: getCategories(),
    }),
  };
};

const getCategories = (): SimpleCategory[] => {
  return [
    buildSimpleCategory('11', 'Children and toys'),
    buildSimpleCategory('3', 'Days out'),
    buildSimpleCategory('1', 'Electrical and phones'),
    buildSimpleCategory('6', 'Entertainment'),
    buildSimpleCategory('8', 'Fashion'),
    buildSimpleCategory('16', 'Featured'),
    buildSimpleCategory('9', 'Financial and insurance'),
    buildSimpleCategory('15', 'Food and drink'),
    buildSimpleCategory('5', 'Gifts'),
    buildSimpleCategory('4', 'Health and beauty'),
    buildSimpleCategory('2', 'Holiday and travel'),
    buildSimpleCategory('10', 'Home and garden'),
    buildSimpleCategory('7', 'Motoring'),
    buildSimpleCategory('17', 'Popular'),
    buildSimpleCategory('14', 'Seasonal'),
    buildSimpleCategory('13', 'Shoes and accessories'),
    buildSimpleCategory('12', 'Sport and leisure'),
  ];
};

const buildSimpleCategory = (id: string, name: string): SimpleCategory => {
  return {
    id,
    name,
  };
};

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
