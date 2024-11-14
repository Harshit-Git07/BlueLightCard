import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { Response } from '../../utils/restResponse/response';
import { APIErrorCode } from '../../enums/APIErrorCode';
import { APIError } from '../../models/APIError';
import braze from './brazeClass';

const service: string = process.env.SERVICE as string;
const logger = new Logger({ serviceName: `${service}-getMarketingPreferences` });
const stage: string = process.env.STAGE as string;

//error messages
const MISSING_QUERY_PARAMETERS_ERROR = 'Missing required query parameters';
const FETCHING_ERROR = 'Error fetching marketing preferences';
const UNKNOWN_ERROR = 'Unknown error occurred while fetching marketing preferences';
const COULD_NOT_RETRIEVE_ERROR = 'Could not retrieve marketing preferences (EL01)';

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  const { brand, memberUUID, version } = event.pathParameters || {};
  let dev = stage === 'production' ? false : true;
  let uuid = memberUUID;
  let mode = version === 'web' ? true : false;

  //check inputs
  if (!brand || !uuid) {
    logger.error({ message: MISSING_QUERY_PARAMETERS_ERROR });
    return Response.BadRequest({
      message: `Error: ${MISSING_QUERY_PARAMETERS_ERROR}`,
      errors: [
        new APIError(
          APIErrorCode.MISSING_REQUIRED_PARAMETER,
          'getMarketingPreferences',
          MISSING_QUERY_PARAMETERS_ERROR,
        ),
      ],
    });
  }

  // do the thing
  try {
    const response = await getMarketingPreferences(dev, brand, uuid, mode);
    return { statusCode: 200, body: JSON.stringify(response) };
  } catch (error) {
    logger.error({ message: `${FETCHING_ERROR}:` + error });
    if (error instanceof Error) {
      return Response.Error(error);
    } else {
      return Response.Error(new Error(UNKNOWN_ERROR));
    }
  }
};

async function getMarketingPreferences(dev: boolean, brand: string, uuid: string, mode: boolean) {
  try {
    const Braze = new braze();
    await Braze.setApiKey(dev, brand);
    let attributes = await Braze.retrieveMarketingPreferences(uuid);
    let response;
    let notFound = Braze.getUserNotFoundString();
    if (attributes === notFound) {
      response = {
        success: false,
        message: attributes,
      };
    } else {
      if (!mode) {
        attributes = extendForMobile(attributes);
      }
      response = {
        success: true,
        data: attributes,
      };
    }
    return response;
  } catch (error) {
    logger.error(`${COULD_NOT_RETRIEVE_ERROR}: ` + error);
    const response = {
      success: false,
      message: COULD_NOT_RETRIEVE_ERROR,
    };
    return response;
  }
}

function extendForMobile(attributes: any) {
  return MARKETING_BRAZE_OPTIONS.map((option) => ({
    ...option,
    status: attributes[option.brazeAlias] === 'opted_in' ? 1 : 0,
  }));
}

const MARKETING_BRAZE_OPTIONS = [
  //email
  {
    optionId: '1',
    displayName: 'Email marketing',
    brand: 'BLC',
    alias: 'emailNews',
    brazeAlias: 'email_subscribe',
    description:
      "We'd like to send you regular email updates about Blue Light Card as well as offers, promotions and competitions by our brand partners. We'd also like to contact you by email to request feedback to improve our marketing on occasion.",
    link: '',
    category: 'email',
    events: [],
  },
  //push
  {
    optionId: '2',
    displayName: 'Push notifications',
    brand: 'BLC',
    alias: 'pushNotifications',
    brazeAlias: 'push_subscribe',
    description:
      "We'd like to send you regular push updates about Blue Light Card as well as offers, promotions and competitions by our brand partners.",
    link: '',
    category: '',
    events: [],
  },
  //sms
  {
    optionId: '3',
    displayName: 'SMS Marketing',
    brand: 'BLC',
    alias: 'sms',
    brazeAlias: 'sms_subscribe',
    description:
      "We'd like to send you regular SMS updates about Blue Light Card as well as offers, promotions and competitions by our brand partners. We'd also like to contact you by email to request feedback to improve our marketing on occasion.",
    link: '',
    category: '',
    events: [],
  },
  //analytics
  {
    optionId: '4',
    displayName: 'Analytics',
    brand: 'BLC',
    alias: 'analytics',
    brazeAlias: 'analytics',
    description:
      'We use cookies and similar technologies to monitor how you use our service, the effectiveness of our content and of retailers featured on our sites.',
    link: '',
    category: '',
    events: [],
  },
  //personalised offers
  {
    optionId: '5',
    displayName: 'Personalised offers',
    brand: 'BLC',
    alias: 'personalisedOffers',
    brazeAlias: 'personalised_offers',
    description:
      'We use cookies and similar technologies to make our service more personal for you, we want to be able to show you offers that we think you will like based on how you use our website and app.',
    link: '',
    category: '',
    events: [],
  },
];
