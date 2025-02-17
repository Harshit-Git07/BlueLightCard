import * as unmarshall from '@aws-sdk/util-dynamodb';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';

jest.mock('@aws-sdk/util-dynamodb');

describe('unmarshallStreamImages', () => {
  const unmarshallMock = jest.spyOn(unmarshall, 'unmarshall').mockImplementation((input) => {
    return input;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should unmarshall the old and new images', () => {
    const streamRecord = {
      OldImage: { key1: { S: 'value1' } },
      NewImage: { key2: { S: 'value2' } },
    };

    const result = unmarshallStreamImages(streamRecord);

    expect(unmarshallMock).toHaveBeenCalledTimes(2);
    expect(result.oldImage).toEqual({ key1: { S: 'value1' } });
    expect(result.newImage).toEqual({ key2: { S: 'value2' } });
  });

  it('should return undefined for old and new images if they are not present', () => {
    const result = unmarshallStreamImages();

    expect(unmarshallMock).not.toHaveBeenCalled();
    expect(result.oldImage).toBeUndefined();
    expect(result.newImage).toBeUndefined();
  });
});
