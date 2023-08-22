import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { type APIGatewayEvent, type APIGatewayProxyStructuredResultV2, type Context } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger'
import { BRANDS } from './../../../core/src/types/brands.enum'
import { Response } from './../../../core/src/utils/restResponse/response'

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
    return Response.BadRequest({ message: 'Please provide brand details' })
  }

  if (!(brand in BRANDS)) {
    return Response.BadRequest({ message: 'Please provide a valid brand' });
  }

  if (organisationId == null) {
    return Response.BadRequest({ message: 'Please provide a valid organisation Id' });
  }

  const data = event.body != null ? JSON.parse(event.body) : {employed: 1};
  if(data != null && (data.retired == undefined || data.retired == 0) && 
  (data.employed == undefined || data.employed == 0) && (data.volunteers == undefined || data.volunteers == 0)) {
    data.employed = 1;
  }
  let filter = '';
  let expAttrValues: Record<string,string> = {};
  
  let attrName: Record<string,string> = {};
  expAttrValues[':pk']= `ORGANISATION#${organisationId}`;
  expAttrValues[':sk']= `EMPLOYER#`;
  attrName['#pk'] = 'pk';
  attrName['#sk'] = 'sk';
  if(data != null && data.retired != undefined && data.retired === 1) {
    expAttrValues[':retired'] = `TRUE`;
    attrName['#retired'] = 'retired';
    filter += `and #retired = :retired`;
  }
  if(data != null && data.employed != undefined && data.employed === 1){
    expAttrValues[':employed'] = `TRUE`;
    attrName['#employed']= 'employed';
    filter += ` and #employed = :employed`;
  }
  if(data != null && data.volunteers != undefined && data.volunteers === 1) {
    expAttrValues[':volunteers'] = `TRUE` ;  
    attrName['#volunteers']= 'volunteers';
    filter += ` and #volunteers = :volunteers`;
  }
  filter = (filter.length > 0 ) ? filter.replace('and','') : '';
   
  const params = {
    ExpressionAttributeValues: expAttrValues,
    ExpressionAttributeNames: attrName,
    TableName: tableName,
    KeyConditionExpression: '#pk= :pk And begins_with(#sk, :sk)',
    FilterExpression : filter,
  }
  try {
    const results = await dynamodb.send(new QueryCommand(params));
    logger.debug('results', { results });
    const apiResponse = results.Items?.map((item) => ({
      id: item.sk.replace(`EMPLOYER#`, ''),
      tk: item.tk,
      name: item.name,
      retired: item.retired,
      volunteers: item.volunteers,
      employed: item.employed,
      idRequirements: item.idRequirements
    }));
    logger.info('employer found', brand);
    return Response.OK( {message: 'Success', data: apiResponse} );
  } catch (error) {
    logger.error('error while fetching employer',{error});
    return Response.Error({
      message: 'error',
      name: ''
    });
  }
};
