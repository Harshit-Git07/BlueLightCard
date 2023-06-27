import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { type APIGatewayEvent, type APIGatewayProxyStructuredResultV2, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger'
import { BRANDS } from './../../../core/src/types/brands.enum'

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-list-employer` });

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const tableName = process.env.tableName;
const apiKeyTableName = process.env.apiKeysTable;

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('input', { event });
  const brand = event.pathParameters != null ? event.pathParameters.brand?.toUpperCase() : null;
  const organisationId = event.pathParameters != null ? event.pathParameters.organisationId : null;

  if (brand == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide a valid brand' }),
    };
  }

  if (!(brand in BRANDS)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide a valid brand' }),
    };
  }

  if (organisationId == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide a valid organisation Id' }),
    };
  }
   
  const params = {
    ExpressionAttributeValues: {
      ':pk': `BRAND#${brand}`,
      ':sk': `ORGANISATION#${organisationId}#EMPLOYER#`
    },
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk'            
    },
    TableName: tableName,
    KeyConditionExpression: '#pk= :pk And begins_with(#sk, :sk)'
  }
  
  try {
    const results = await dynamodb.send(new QueryCommand(params));
    logger.debug('results', { results });
    const apiResponse = results.Items?.map((item) => ({
      id: item.sk.replace(`ORGANISATION#${organisationId}#EMPLOYER#`, ''),
      name: item.name,
    }));
    logger.info('employer found', brand);
    return {
      statusCode: 200,
      body: JSON.stringify({ employers: apiResponse }),
    };
  } catch (error) {
    logger.error('error while fetching employer',{error});
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
