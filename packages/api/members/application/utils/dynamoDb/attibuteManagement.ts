import { StreamRecord } from 'aws-lambda/trigger/dynamodb-stream';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

export const hasAttributeChanged = (key: string, dynamoStream: StreamRecord | undefined) => {
  // The two dynamo libraries seem to get confused with this type, even though they are the same
  const oldImage =
    dynamoStream?.OldImage != null
      ? unmarshall(dynamoStream.OldImage as unknown as AttributeValue)
      : {};
  const newImage =
    dynamoStream?.NewImage != null
      ? unmarshall(dynamoStream.NewImage as unknown as AttributeValue)
      : {};

  if (newImage[key] != null) {
    if (oldImage[key] != null) {
      return newImage[key] !== oldImage[key];
    }

    return true;
  }

  return false;
};
