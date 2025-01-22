import { sqsMiddleware } from '../../../middleware';
import { Repository } from '@blc-mono/members/application/repositories/repository';
import { SQSEvent } from 'aws-lambda';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { getMemberProfilesSeedSearchIndexTableName } from '@blc-mono/members/application/handlers/admin/search/getMemberProfileResources';

const repository = new Repository();
const tableName = getMemberProfilesSeedSearchIndexTableName();

const unwrappedHandler = async (event: SQSEvent) => {
  const timestamp = new Date().toISOString();

  for (const record of event.Records) {
    const recordsToInsert = JSON.parse(record.body) as (
      | ProfileModel
      | CardModel
      | ApplicationModel
    )[];

    const updatedRecordsToInsert = recordsToInsert.map((record) => {
      return {
        ...record,
        ingestionLastTriggered: timestamp,
      };
    });

    await repository.batchInsert(updatedRecordsToInsert, tableName);
  }
};

export const handler = sqsMiddleware(unwrappedHandler);
