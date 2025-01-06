import { StreamRecord } from 'aws-lambda/trigger/dynamodb-stream';
import { unmarshall } from '@aws-sdk/util-dynamodb';

export const hasAttributeChanged = (key: string, dynamoStream: StreamRecord | undefined) => {
  // @ts-ignore
  const oldImage = dynamoStream.OldImage != null ? unmarshall(dynamoStream.OldImage) : {};

  // @ts-ignore
  const newImage = dynamoStream.NewImage != null ? unmarshall(dynamoStream.NewImage) : {};

  if (newImage[key] != null && newImage[key] != undefined) {
    if (oldImage[key] != null && oldImage[key] != undefined) {
      if (newImage[key] != oldImage[key]) {
        // is on old record - but different - therefore has changed
        return true;
      }
    } else {
      // not on old record - been added - therefore has changed
      return true;
    }
  }
  return false;
};
