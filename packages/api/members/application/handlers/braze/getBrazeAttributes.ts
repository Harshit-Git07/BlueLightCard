import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../utils/restResponse/response';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { APIError } from '../../models/APIError';
import braze from './brazeClass';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-getBrazeAttributes` });
const stage: string = process.env.STAGE as string;

//error messages
const NO_BODY_ERROR = 'Missing body required';
const MISSING_BODY_PARAMETERS_ERROR = 'Missing required body parameters';
const NO_ATTRIBUTES_PASSED_ERROR = 'No attributes passed';
const FETCHING_ERROR = 'Error fetching attributes';
const UNKNOWN_ERROR = 'Unknown error occurred while fetching attributes';
const COULD_NOT_RETRIEVE_ERROR = 'Could not retrieve attributes (EL01)';

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const { body } = event || {};

  //check inputs
  if (!body) {
    logger.error({ message: NO_BODY_ERROR });
    return Response.BadRequest({
      message: `Error: ${NO_BODY_ERROR}`,
      errors: [
        new APIError(APIErrorCode.MISSING_REQUIRED_PARAMETER, 'getBrazeAttributes', NO_BODY_ERROR),
      ],
    });
  }

  const { brand, memberUUID, attributes } = JSON.parse(body);
  let dev = stage === 'production' ? false : true;
  let uuid = memberUUID;

  //check inputs
  if (!brand || dev === undefined || !uuid) {
    logger.error({ message: MISSING_BODY_PARAMETERS_ERROR });
    return Response.BadRequest({
      message: `Error: ${MISSING_BODY_PARAMETERS_ERROR}`,
      errors: [
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          'getBrazeAttributes',
          MISSING_BODY_PARAMETERS_ERROR,
        ),
      ],
    });
  }

  if (attributes === undefined) {
    logger.error({ message: NO_ATTRIBUTES_PASSED_ERROR });
    return Response.BadRequest({
      message: `Error: ${NO_ATTRIBUTES_PASSED_ERROR}`,
      errors: [
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          'getBrazeAttributes',
          NO_ATTRIBUTES_PASSED_ERROR,
        ),
      ],
    });
  }

  // do the thing
  try {
    const response = await getAttributes(dev, brand, uuid, attributes);
    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (error) {
    logger.error({ message: `${FETCHING_ERROR}: ` + error });
    if (error instanceof Error) {
      return Response.Error(error);
    } else {
      return Response.Error(new Error(UNKNOWN_ERROR));
    }
  }
};

async function getAttributes(dev: boolean, brand: string, uuid: string, attributes: string[]) {
  try {
    const Braze = new braze();
    await Braze.setApiKey(dev, brand);
    const payload = await Braze.getAttributes(uuid, attributes);
    let response;
    let notFound = Braze.getUserNotFoundString();
    if (payload === notFound) {
      response = {
        success: false,
        message: payload,
      };
    } else {
      response = {
        success: true,
        data: payload,
      };
    }
    return response;
  } catch (error) {
    logger.error(`${COULD_NOT_RETRIEVE_ERROR}: ` + error);
    return {
      success: false,
      message: COULD_NOT_RETRIEVE_ERROR,
    };
  }
}
