import { SQSClient } from '@aws-sdk/client-sqs';
import { Logger } from '@aws-lambda-powertools/logger';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { Response } from '../../../core/src/utils/restResponse/response'
import { BRANDS } from '../../../core/src/types/brands.enum';
import { UserProfileModel, UserProfile } from '../../src/models/userprofile';
import { sendToDLQ } from '../../src/helpers/DLQ';
import { ZodError } from 'zod';
import { v4 } from 'uuid';
import { transformDateToFormatYYYYMMDD } from '../../../core/src/utils/date';


const service: string = process.env.SERVICE as string
const tableName = process.env.TABLE_NAME;
const logger = new Logger({ serviceName: `${service}-syncProfileStatusUpdate` })
const sqs = new SQSClient({ region: process.env.REGION ?? 'eu-west-2'});

const client = new DynamoDBClient({region: process.env.REGION ?? 'eu-west-2'});
const dynamodb = DynamoDBDocumentClient.from(client);

const validateFormData = (data: UserProfile) => {
    if(data.dob === undefined && data.employer === undefined && data.employer_id === undefined && 
    data.firstname === undefined && data.surname === undefined && 
    data.ga_key === undefined && data.gender === undefined && 
    data.merged_time === undefined && data.merged_uid === undefined && 
    data.mobile === undefined && data.organisation === undefined && 
    data.spare_email === undefined && data.spare_email_validated === undefined){
            return false;
    }
    return true;
    
  };

export const handler = async (event: any, context: any) => {
  logger.debug('event received', event);
  const brand = (event.detail !== undefined || event.detail !== null) ? event.detail.brand?.toUpperCase() : null;

  if (brand == null) {
    logger.error('brand details missing', brand);
    return Response.BadRequest({ message: 'Please provide brand details' });
  }

  if (!(brand in BRANDS)) {
    logger.error('invalid brand', brand);
    return Response.BadRequest({ message: 'Please provide a valid brand' });
  }

  if(event.detail.uuid === undefined || event.detail.uuid === ''
  ){
    logger.error('required parameters are missing');
    return Response.BadRequest({ message: 'Required parameters are missing' });
  }
  const uuid = event.detail.uuid;
  delete event.detail.uuid;
  delete event.detail.brand;
  let detail: UserProfile;
  try{
   detail = UserProfileModel.parse(event.detail);
   const isValid = validateFormData(detail);
  if(!isValid){
    logger.error('Required parameters are missing');
    return Response.BadRequest({ message: 'Required parameters are missing' });
  }
  }catch(err:any ){
    logger.error('invalid data type', err.message);
    return Response.BadRequest({ message: 'Invalid data type' });
  }
  
  const queryParams = {
    TableName: tableName,
    KeyConditionExpression: '#pk= :pk And begins_with(#sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `MEMBER#${uuid}`,
      ':sk': `PROFILE#`,
    },
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
  };
  let profileUuid = null;
  let action = 'created';
  let spareEmail = 'NA';
    const result = await dynamodb.send(new QueryCommand(queryParams));
    if(result.Items === null || result.Items?.length === 0){
      logger.debug('user profile data not found, will be created', event);
      profileUuid = `PROFILE#${v4()}`;
    }else{
        const user = result.Items?.at(0) as Record<string, string>;
        profileUuid = user.sk;
        action = 'updated';
        spareEmail = user?.spare_email ? user.spare_email.replace(/\s/g, '') === '' ? 'NA' : user.spare_email.replace(/\s/g, '') : 'NA';
    }

    let updateExp = '';
  
    let expAttrValues: Record<string,any> = {};
    (Object.keys(detail) as (keyof typeof detail)[]).find((key) => {
      if(key === 'dob'){
        detail[key]= typeof detail[key] === "string" ? transformDateToFormatYYYYMMDD(String(detail[key])) : null;
      }else if(key === 'spare_email'){
        detail[key] = detail[key] === '' ? 'NA' : detail[key] ?? 'NA';
      }
        updateExp += ` ${key} = :${key},`;
        expAttrValues[`:${key}`] = detail[key];
    });
    updateExp = updateExp.slice(0, -1);
    if(!updateExp.includes('spare_email')){
      updateExp += ', spare_email = :spare_email';
      expAttrValues[':spare_email'] = spareEmail;
    }

    const updateParams: UpdateCommandInput = {  
        TableName: tableName,
        Key: {
            "pk"   : `MEMBER#${uuid}`,
            "sk"  : `${profileUuid}`

        },
        UpdateExpression: `set ${updateExp}`,
        ExpressionAttributeValues: expAttrValues, 
        ReturnValues: "UPDATED_NEW",
    };
  
  try {
    const results = await dynamodb.send(new UpdateCommand(updateParams));
    if(results.$metadata.httpStatusCode !== 200) { 
        logger.error("error syncing user profile data", { uuid, results });
        await sendToDLQ(event);
        return Response.BadRequest({ message: 'error syncing user profile data' });
    }   
    return Response.OK({ message: `user profile data ${action}` });
  } catch (err: any) {
    logger.error("error syncing user profile data", { uuid, err });
    await sendToDLQ(event);
  }
};