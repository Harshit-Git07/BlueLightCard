import { APIGatewayEvent } from 'aws-lambda';

import { Response as HandlerResponse } from '@blc-mono/core/utils/restResponse/response';

export interface IAPIGatewayEvent extends APIGatewayEvent {
  body: string;
}

type Handler = (event: IAPIGatewayEvent) => Promise<HandlerResponse>;

export const RestApiHandler = (handler: Handler) => {
  return async (event: IAPIGatewayEvent) => {
    try {
      return await handler(event);
    } catch (error) {
      if (error instanceof Error) {
        return HandlerResponse.createResponse(500, { message: error.message });
      } else {
        return HandlerResponse.createResponse(500, { message: 'Internal Server Error' });
      }
    }
  };
};
