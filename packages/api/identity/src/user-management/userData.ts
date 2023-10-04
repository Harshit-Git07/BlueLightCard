import { APIGatewayEvent, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { UserModel } from '../models/user';
import { CardModel } from '..//models/card';
import { BrandModel } from '..//models/brand';
import { Response } from '../../../core/src/utils/restResponse/response';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { isEmpty } from 'lodash';
import { unpackJWT } from './unpackJWT';

const service: string = process.env.service as string;

const logger = new Logger({ serviceName: `${service}-user-crud` });

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const tableName = process.env.identityTableName;

export const get = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.debug('input', { event });
  

  let authorization_header = "";
  if (event.headers.Authorization != undefined || event.headers.Authorization != "") {
    authorization_header = event.headers.Authorization??""
  }

  let jwtInfo = unpackJWT(authorization_header);

  // @ts-ignore: Object is possibly 'null'. 
  
  const params_profile = {
    "TableName": tableName,
    "KeyConditionExpression": "#pk = :pk",
    "ExpressionAttributeNames": {
        "#pk": "pk"
    },
    "ExpressionAttributeValues": {
        ":pk": `MEMBER#${jwtInfo['custom:blc_old_uuid']}`
    }
  }

  try {
    logger.debug('param ', { params_profile });

    const results = await dynamodb.send(new QueryCommand(params_profile));

    logger.debug('Member Query Results ', results);

    let userDetails: any = {};
    let cardDetails = {};
    let brandDetails = {};

    results.Items?.map(i => {
      if(i.sk.includes('PROFILE')) {
        userDetails = UserModel.parse(i)
      } else if (i.sk.includes('CARD')) {
        cardDetails = CardModel.parse(i)
      } else if (i.sk.includes('BRAND')) {
        brandDetails = BrandModel.parse(i)
      } 
    })

    if(!isEmpty(userDetails)) {
      const combinedUserData = {...userDetails, ...cardDetails, ...brandDetails};
      logger.info("User Found", combinedUserData);
      return Response.OK({ message: 'User Found', data: combinedUserData });
    }
    return Response.NoContent({ message: 'User not found' });

  } catch (error) {
    logger.error('error while fetching user details ',{error});
    return Response.Error(error as Error);
  }
};
