import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { type APIGatewayEvent, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger'
import { BRANDS } from '../../../core/src/types/brands.enum'
import { Response } from '../../../core/src/utils/restResponse/response'
import { v4 as uuidv4 } from 'uuid';

const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-ec-form-output-data` });

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);
const tableName = process.env.ecFormOutputDataTableName;
const allowedDomains = process.env.allowedDomains ? process.env.allowedDomains.split(', ') : [];

export const handler = async (event: APIGatewayEvent, context: Context): Promise<object> => {
  logger.info('input', { event });

  const clientOrigin = event.headers.origin ?? '';

  const headers = {
    "Access-Control-Allow-Origin": allowedDomains[0]
  }

  if (allowedDomains.includes(clientOrigin)) {
      headers["Access-Control-Allow-Origin"] = clientOrigin;
  }

  const brand = event.pathParameters != null ? event.pathParameters.brand?.toUpperCase() : null;

  if (brand == null || !(brand in BRANDS)) {
    return Response.BadRequest({ message: 'Please provide a valid brand' }, headers);
  }
  
  if(event.body == null) {
    return Response.BadRequest({ message: 'Please provide a valid request body' }, headers);
  }

  const formData = JSON.parse(event.body);
  const data = {
    pk: uuidv4(),
    sk: `BRAND#${brand}`,
    organisation: formData.organisation,
    jobRole: formData.jobRole,
    employer: formData.employer,
    dateTime: Date.now(),
    employmentStatus: formData.employmentStatus
  }
  
  try {
    await dynamodb.send(
      new PutCommand({
        TableName: tableName,
        Item: data,
      })
    );
    logger.info('Added EC form output data successfully');
    return Response.OK( {message: 'Success', data: data}, headers);
    
  } catch (error) {
    logger.error('error adding EC form output data',{error}, headers);
    return Response.Error(error as Error);
  }
};