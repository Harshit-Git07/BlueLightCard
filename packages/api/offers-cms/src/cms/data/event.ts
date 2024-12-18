import { type Event } from '@bluelightcard/sanity-types';
import { Table } from 'sst/node/table';

import { dynamo } from '../../lib/dynamo';

export async function getEvent(id: string) {
  const res = await dynamo.query({
    TableName: Table.cmsEvent.tableName,
    ExpressionAttributeNames: { '#id': '_id' },
    ExpressionAttributeValues: { ':Id': id },
    KeyConditionExpression: '#id = :Id',
  });

  if (!res.Items || res.Items.length === 0) {
    return null;
  }

  return res.Items[0] as Event;
}
