import { S3Event } from 'aws-lambda';
import { OrganisationsRepository } from '../../repositories/organisationsRepository';
import { MemberProfileRepository } from '../../repositories/memberProfileRepository';
import { EmployersRepository } from '../../repositories/employersRepository';
import { MemberProfileService } from '../../services/memberProfileService';
import { LambdaLogger as Logger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { APIError } from '../../models/APIError';

const service: string = process.env.SERVICE as string;
const entityName: string = process.env.ENTITY_NAME as string;
const logger = new Logger({ serviceName: `${service}-update${entityName}` });
const profileTableName = process.env.IDENTITY_TABLE_NAME as string;
const noteTableName = process.env.NOTE_TABLE_NAME as string;
const dynamoDB = DynamoDBDocument.from(new DynamoDB({ region: process.env.REGION ?? 'eu-west-2' }));

const repository = new MemberProfileRepository(dynamoDB, profileTableName, noteTableName);
const organisation = new OrganisationsRepository(dynamoDB, profileTableName);
const employer = new EmployersRepository(dynamoDB, profileTableName);
const profileService = new MemberProfileService(repository, organisation, employer, logger);

export const handler = async (event: S3Event): Promise<void> => {
  for (const record of event.Records) {
    const key = record.s3.object.key;
    const memberUUID = key.split('/')[1];
    const errorSet: APIError[] = [];

    try {
      await profileService.updateIdUploaded({ memberUUID }, { idUploaded: true }, errorSet);
      await profileService.createSystemNote(memberUUID, {
        category: 'ID Uploaded',
        message: `ID document uploaded successfully on ${new Date().toISOString()}`,
      });
      logger.info({ message: 'ID upload processing completed successfully', body: memberUUID });
    } catch (error) {
      logger.error({
        message: 'Error processing ID upload',
        error: error instanceof Error ? error.message : 'Unknown error idUploaded',
      });
      throw error;
    }
  }
};
