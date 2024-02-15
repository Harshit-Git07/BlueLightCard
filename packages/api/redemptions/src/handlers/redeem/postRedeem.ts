import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Response } from '@blc-mono/core/utils/restResponse/response';

import { getRedemptionConfig, getRedemptionStrategy } from '../../helpers/redemptionConfig';
import { IAPIGatewayEvent, RestApiHandler } from '../../helpers/RestApiHandler';

const service: string = getEnvRaw('SERVICE_NAME') ?? 'redemptions';
const logger = new LambdaLogger({ serviceName: `${service}-redeem-post` });

/**
 * Handler for a REST API endpoint to redeem an offer.
 *
 * @param {IAPIGatewayEvent} event - The API Gateway event object.
 * @returns {Promise<Response>} - The response object.
 */
export const handler = RestApiHandler(async (event: IAPIGatewayEvent) => {
  logger.info({
    message: 'POST Redeem Input',
  });
  const { offerId } = JSON.parse(event.body);

  const redemptionConfig = await getRedemptionConfig(offerId);

  if (!redemptionConfig.length) {
    return Response.BadRequest({ message: 'Invalid OfferId' });
  }

  const handleRedemption = getRedemptionStrategy(redemptionConfig[0].redemptionType);

  if (!handleRedemption) {
    logger.info({
      message: `${redemptionConfig[0].redemptionType} is invalid'`,
      status: 400,
    });
    return Response.BadRequest({ message: `${redemptionConfig[0].redemptionType} is invalid` });
  }

  logger.info({
    message: `'handling redemption type: ${redemptionConfig[0].redemptionType}`,
  });

  await handleRedemption(redemptionConfig[0]);
  const response = Response.createResponse(200, {
    data: redemptionConfig[0],
    message: 'OK',
  });

  logger.info({
    message: `'successfully handled: ${redemptionConfig[0].redemptionType}`,
    body: response,
  });
  return response;
});
