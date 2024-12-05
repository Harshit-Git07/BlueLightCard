import { StreamRecord } from 'aws-lambda/trigger/dynamodb-stream';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue as DynamoDBAttributeValue } from '@aws-sdk/client-dynamodb';

export const unmarshallStreamImages = <T>(
  streamRecord?: StreamRecord,
): {
  oldImage: T | undefined;
  newImage: T | undefined;
} => {
  return {
    oldImage: streamRecord?.OldImage
      ? (unmarshall(streamRecord.OldImage as { [key: string]: DynamoDBAttributeValue }) as T)
      : undefined,
    newImage: streamRecord?.NewImage
      ? (unmarshall(streamRecord.NewImage as { [key: string]: DynamoDBAttributeValue }) as T)
      : undefined,
  };
};
