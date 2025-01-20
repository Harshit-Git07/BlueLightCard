import { AttributeValue, StreamRecord } from 'aws-lambda/trigger/dynamodb-stream';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue as DynamoClientAttributeValue } from '@aws-sdk/client-dynamodb';

export interface StreamImages<ImageType> {
  oldImage: ImageType | undefined;
  newImage: ImageType | undefined;
}

export function unmarshallStreamImages<ImageType>(
  streamRecord?: StreamRecord,
): StreamImages<ImageType> {
  return {
    oldImage: unmarshallImage(streamRecord?.OldImage),
    newImage: unmarshallImage(streamRecord?.NewImage),
  };
}

type StreamRecordImage = Record<string, AttributeValue>;

function unmarshallImage<ImageType>(
  streamRecordImage: StreamRecordImage | undefined,
): ImageType | undefined {
  if (streamRecordImage === undefined) return undefined;

  // AWS SDK seems to get confused between the types here, so doing a hard cast to the other type
  return unmarshall(streamRecordImage as unknown as DynamoClientAttributeValue) as ImageType;
}
