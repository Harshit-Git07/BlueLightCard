import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { type APIGatewayEvent, type APIGatewayProxyStructuredResultV2, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger'
import { BRANDS } from './../../../core/src/types/brands.enum'

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-list-organisation` });

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const tableName = process.env.tableName;
const apiKeyTableName = process.env.apiKeysTable;

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
  logger.info('input', { event });
  const brand = event.pathParameters != null ? event.pathParameters.brand?.toUpperCase() : null;

  if (brand == null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide brand details' }),
    };
  }

  if (!(brand in BRANDS)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please provide a valid brand' }),
    };
  }
  
  const data = event.body != null ? JSON.parse(event.body) : null;
  
  const params = {
    ExpressionAttributeValues: {
      ':sk': `BRAND#${brand}`,
      ':pk': `ORGANISATION#`,  
      ':retired': (data != null && data.retired != undefined && data.retired === 1) ? `true` : `false`      
    },
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk', 
      '#retired': 'retired'            
    },
    TableName: tableName,
    IndexName: 'gsi1',
    KeyConditionExpression: '#sk= :sk And begins_with(#pk, :pk)',
    FilterExpression : "#retired = :retired",
  }
  try {
    const results = await dynamodb.send(new QueryCommand(params));
    logger.info('results', { results });
    const response = results.Items? results.Items : {};

    const apiResponse = results.Items?.map((item) => ({
      id: item.pk.replace('ORGANISATION#', ''),
      code: item.code,
      name: item.name,
      retired: item.retired,
      idRequirements: item.idRequirements,
      maxUploads: item.maxUploads,
      isTrusted: item.trustedDomain
    }));
    logger.info('organisation found', brand);
    return {
      statusCode: 200,
      body: JSON.stringify({ organisations: apiResponse }),
    };
  } catch (error) {
    logger.error('error while fetching organisation',{error});
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
