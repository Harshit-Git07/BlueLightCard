import 'dd-trace/init';

import { datadog } from 'datadog-lambda-js';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';
import { SimpleCategory } from '@blc-mono/discovery/application/models/SimpleCategory';
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const logger = new LambdaLogger({ serviceName: 'categories-get' });

export const categories = getCategories();

const handlerUnwrapped = async () => {
  logger.info({ message: `Getting categories` });
  return Response.OK({ message: 'Success', data: categories });
};

function getCategories(): SimpleCategory[] {
  /* This is a hardcoded list of categories! Do not change anything here unless the corresponding
   * list in CMS has also been updated, or they will be out of sync and this could potentially
   * cause an incident.
   */
  return [
    buildSimpleCategory('13', 'Health and Beauty'),
    buildSimpleCategory('16', 'Children and Toys'),
    buildSimpleCategory('8', 'Electrical'),
    buildSimpleCategory('4', 'Fashion'),
    buildSimpleCategory('7', 'Financial and Insurance'),
    buildSimpleCategory('12', 'Food and Drink'),
    buildSimpleCategory('17', 'Gifts and Flowers'),
    buildSimpleCategory('15', 'Holiday and Travel'),
    buildSimpleCategory('1', 'Home'),
    buildSimpleCategory('6', 'Jewellery and Watches'),
    buildSimpleCategory('11', 'Leisure and Entertainment'),
    buildSimpleCategory('18', 'Motor'),
    buildSimpleCategory('3', 'Pets'),
    buildSimpleCategory('9', 'Phones'),
    buildSimpleCategory('14', 'Sports and Fitness'),
    buildSimpleCategory('19', 'Events'),
  ];
}

function buildSimpleCategory(id: string, name: string): SimpleCategory {
  return {
    id,
    name,
  };
}

export const handler = USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
