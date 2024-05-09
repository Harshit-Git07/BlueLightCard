import {
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  DescribeUserPoolClientCommand,
  ListUserPoolClientsCommand,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';
import { generate as generatePassword } from 'generate-password';
import { cognitoIdpClient, logger } from '../instances';
import { BLC_EMAIL_DOMAIN } from '../constants';

type CreateUserData = {
  usernamePrefix: string;
  uuid: string;
  legacyUserId: number;
};

export async function getUserPoolClient(poolId: string, clientName: string) {
  const command = new ListUserPoolClientsCommand({
    UserPoolId: poolId,
    MaxResults: 5,
  });
  logger.info({ message: `Retrieving user pool client '${clientName}' from pool '${poolId}'` });
  const response = await cognitoIdpClient.send(command);
  const findUserPoolClient = response.UserPoolClients?.find((userPoolClient) =>
    userPoolClient.ClientName?.startsWith(clientName),
  );

  return findUserPoolClient;
}

export async function getUserPoolClientSecret(poolId: string, clientId: string) {
  const command = new DescribeUserPoolClientCommand({
    UserPoolId: poolId,
    ClientId: clientId,
  });
  logger.info({ message: `Retrieving user pool client secret from pool '${poolId}'` });
  const response = await cognitoIdpClient.send(command);
  const clientSecret = response.UserPoolClient?.ClientSecret;

  return clientSecret;
}

export async function createUser(
  poolId: string,
  { usernamePrefix, uuid, legacyUserId }: CreateUserData,
) {
  const username = `${usernamePrefix}@${BLC_EMAIL_DOMAIN}`;
  const password = generatePassword({
    length: 10,
    numbers: true,
  });

  try {
    const adminCreateUserCommand = new AdminCreateUserCommand({
      UserPoolId: poolId,
      Username: username,
      MessageAction: MessageActionType.SUPPRESS,
      UserAttributes: [
        {
          Name: 'custom:blc_old_id',
          Value: String(legacyUserId),
        },
        {
          Name: 'custom:blc_old_uuid',
          Value: uuid,
        },
      ],
    });
    logger.info({ message: `Creating user '${username}' under pool '${poolId}'` });
    await cognitoIdpClient.send(adminCreateUserCommand);
  } catch (error) {
    if ((error as Error).name !== 'UsernameExistsException') {
      throw error;
    }
  }

  const adminSetPasswordCommand = new AdminSetUserPasswordCommand({
    UserPoolId: poolId,
    Username: username,
    Password: password,
    Permanent: true,
  });

  logger.info({ message: `Setting user password for user '${username}' under pool '${poolId}'` });
  await cognitoIdpClient.send(adminSetPasswordCommand);

  return { username, password };
}
