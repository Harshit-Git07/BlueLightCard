import 'reflect-metadata';
import { APIGatewayEvent } from 'aws-lambda';
import { container } from 'tsyringe';
import { LambdaLogger } from '../../../../core/src/utils/logger/lambdaLogger';
import { Logger } from '../../../../core/src/utils/logger/logger';
import { Response } from '../../../../core/src/utils/restResponse/response';
import {
  OfferHomepageQueryInput,
  OfferHomepageQueryInputModel,
} from '../../models/queries-input/homepageMenuQueryInput';
import { IOffersHomepageService, OffersHomepageService } from '../../services/offersHomepageService';
import { DI_KEYS } from '../../utils/diTokens';

const logger = new LambdaLogger({ serviceName: `offers-homepage-handler` });
container.register(Logger.key, { useValue: logger });
const tableName = process.env.OFFER_HOMEPAGE_TABLE_NAME as string;
container.register(DI_KEYS.OffersHomePageTable, { useValue: tableName });
const homepageService: IOffersHomepageService = container.resolve(OffersHomepageService);

export const handler = async (event: APIGatewayEvent) => {
  try {
    logger.info({ message: 'get homepage offers handler', body: event.queryStringParameters });
    const { brandId, isUnder18, organisation } = validateQueryParams(
      event.queryStringParameters! as unknown as OfferHomepageQueryInput,
    );

    if (!tableName) {
      return Response.Error(Error('Table name not set'));
    }

    const homepageOffers = await homepageService.getHomepage(tableName, { brandId, isUnder18, organisation });
    return Response.OK({
      message: 'Offers Homepage Menus',
      data: homepageOffers,
    });
  } catch (error) {
    logger.error({ message: 'Error in OfferMenusByBrandIdResolver', body: error });
    return error;
  }
};

function validateQueryParams(queryParams?: OfferHomepageQueryInput): OfferHomepageQueryInput {
  if (queryParams) {
    const result = OfferHomepageQueryInputModel.safeParse(queryParams);
    logger.info({ message: 'queryparams received', body: { queryParams } });
    if (result.success) {
      return queryParams;
    } else {
      logger.error({ message: `Error validating homepage query input ${result.error}` });
      throw Response.BadRequest({ message: `Error validating homepage query input`, error: result.error.issues });
    }
  } else {
    throw Response.BadRequest({ message: `Error validating homepage query params - no query params found` });
  }
}
