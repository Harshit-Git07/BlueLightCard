import { AuthenticationClient, ManagementClient } from 'auth0';
import { fetchWithRetry } from '@blc-mono/members/application/auth0/utils/fetchWithRetry';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';
import { secretsObject } from '../types/auth0types';
import { EmailPayload } from '@blc-mono/shared/models/members/emailModel';

export const passwordValidationClient = new AuthenticationClient({
  domain: process.env.SERVICE_LAYER_AUTH0_DOMAIN as string,
  clientId: process.env.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_ID as string,
  clientSecret: process.env.SERVICE_LAYER_AUTH0_PASSWORD_VALIDATION_CLIENT_SECRET,
  idTokenSigningAlg: 'HS256', // required if authenticating through client secret
  fetch: fetchWithRetry,
});

export const managementApiClient = (
  clientId: string = process.env.SERVICE_LAYER_AUTH0_API_CLIENT_ID as string,
  clientSecret: string = process.env.SERVICE_LAYER_AUTH0_API_CLIENT_SECRET as string,
  domain: string = process.env.SERVICE_LAYER_AUTH0_DOMAIN as string,
) =>
  new ManagementClient({
    domain,
    clientId,
    clientSecret,
    fetch: fetchWithRetry,
  });

export async function getToken(secrets: secretsObject): Promise<string> {
  const auth0 = new AuthenticationClient({ ...secrets });

  const audience = `https://${secrets.domain}/api/v2/`;

  try {
    const response = await auth0.oauth.clientCredentialsGrant({ ...secrets, audience });

    const data = response.data;

    if (!data.access_token) {
      throw new Error('No access token received from Auth0.');
    }

    return data.access_token;
  } catch (error) {
    throw new Error(`Failed to get Auth0 management API token: ${error}`);
  }
}

export async function getUserAuth0IdByEmail(
  email: string,
  token: string,
  domain: string,
): Promise<string> {
  try {
    const managementClient = new ManagementClient({
      token,
      domain,
    });
    const response = await managementClient.usersByEmail.getByEmail({ email, fields: 'user_id' });

    const data = response.data;
    if (data.length === 0) {
      throw new Error(`User with email ${email} not found.`);
    }

    return data[0].user_id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    throw error;
  }
}

export async function getEmailVerificationUrl(
  userId: string,
  secrets: secretsObject,
): Promise<string> {
  const managementClient = new ManagementClient({
    domain: secrets.domain,
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
  });

  const loginUrl = getEnvOrDefault(MemberStackEnvironmentKeys.EMAIL_SERVICE_AUTH0_LOGIN_URL, '');
  const response = await managementClient.tickets.verifyEmail({
    user_id: userId,
    result_url: loginUrl,
  });
  return response.data.ticket;
}

export async function unverifyOrChangeEmail(
  payload: EmailPayload,
  token: string,
  id: string,
  domain: string,
) {
  const emailValue = payload.newEmail ?? payload.email;
  try {
    const managementClient = new ManagementClient({
      token: token,
      domain: domain,
    });
    const params = {
      email: emailValue,
      email_verified: false,
    };
    const response = await managementClient.users.update({ id }, params);
    if (!response.data.app_metadata.memberUuid) {
      throw new Error('Error finding user uuid');
    }
    return response.data.app_metadata.memberUuid;
  } catch (error) {
    console.error('Error sending validation email:', error);
    throw error;
  }
}
