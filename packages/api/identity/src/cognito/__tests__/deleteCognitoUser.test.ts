import { mockClient } from 'aws-sdk-client-mock';
import * as DLQ from 'src/helpers/DLQ';
import * as deleteUserFromCognito from '../deleteUserFromCognito';
import { handler } from '../deleteCognitoUser';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const ddbMock = mockClient(DynamoDBDocumentClient);

jest.mock('src/helpers/DLQ');
const sendToDLQMock = DLQ as jest.Mocked<typeof DLQ>;

jest.mock('../deleteUserFromCognito');
const deleteUserFromCognitoMock = deleteUserFromCognito as jest.Mocked<
  typeof deleteUserFromCognito
>;

const eventForBLC = {
  detail: {
    user_email: 'BLCuser@email.com',
    brand: 'blc-uk',
  },
};
const eventForDDS = {
  detail: {
    user_email: 'DDSuser@email.com',
    brand: 'dds',
  },
};

describe('delete cognito user handler', () => {
  beforeEach(() => {
    ddbMock.on(DeleteCommand).resolves({});
  });

  afterEach(() => {
    ddbMock.reset();
    jest.resetAllMocks();
  });

  it('should not delete cognito user as email is missing from event detail', async () => {
    const expected = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'user_email was not defined in request, not deleting any user.',
      }),
    };

    const actual = await handler({ detail: {} });

    expect(deleteUserFromCognitoMock.deleteUserFromCognito).toHaveBeenCalledTimes(0);
    expect(actual).toEqual(expected);
  });

  it('should delete cognito user from new and old pool for BLC', async () => {
    const expected = {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${eventForBLC.detail.user_email} deleted.`,
      }),
    };

    const actual = await handler(eventForBLC);

    expect(deleteUserFromCognitoMock.deleteUserFromCognito).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(expected);
  });

  it('should delete cognito user from new and old pool for DDS', async () => {
    const expected = {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${eventForDDS.detail.user_email} deleted.`,
      }),
    };

    const actual = await handler(eventForDDS);

    expect(deleteUserFromCognitoMock.deleteUserFromCognito).toHaveBeenCalledTimes(2);
    expect(actual).toEqual(expected);
  });

  it('should throw error if dynamodb delete command is rejected', async () => {
    try {
      ddbMock.on(DeleteCommand).rejects(new Error('Error Deleting'));
      await handler(eventForBLC);
    } catch (e: any) {
      expect(e.message).toBe('Error deleting user : Error Deleting.');
      expect(sendToDLQMock.sendToDLQ).toHaveBeenCalled();
    }
  });

  it('should try to remove user from dynamodb despite deleteUserFromCognito throwing an error', async () => {
    deleteUserFromCognitoMock.deleteUserFromCognito.mockResolvedValue({
      statusCode: 500,
      body: JSON.stringify({
        message: `User could not be deleted`,
      }),
    });
    const expected = {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${eventForBLC.detail.user_email} deleted.`,
      }),
    };

    const actual = await handler(eventForBLC);

    expect(actual).toEqual(expected);
  });
});
