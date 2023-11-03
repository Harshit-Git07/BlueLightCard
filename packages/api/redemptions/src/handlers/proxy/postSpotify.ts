import { Logger } from '@aws-lambda-powertools/logger';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { RequestResponse, httpRequest } from '@blc-mono/core/src/utils/fetch/httpRequest';
import { Response } from '@blc-mono/core/src/utils/restResponse/response';
import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { generateKey } from '../../helpers/newVaultAuth';

export interface IAPIGatewayEvent extends APIGatewayEvent {
  body: string;
}
const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-post` });
enum ErrorMessages {
  MissingEndpoint = 'empty environment variables - missing endpoint',
}

type ValidationParams = {
  codeRedeemedHost: string;
  codeRedeemedEnvironment: string;
  codeRedeemedPath: string;
  assignUserCodesPath: string;
};

function validateEnvironmentVariables({
  codeRedeemedHost,
  codeRedeemedPath,
  assignUserCodesPath,
  codeRedeemedEnvironment,
}: ValidationParams) {
  if (!codeRedeemedHost) {
    return ErrorMessages.MissingEndpoint;
  } else if (!codeRedeemedPath) {
    return ErrorMessages.MissingEndpoint;
  } else if (!codeRedeemedEnvironment) {
    return ErrorMessages.MissingEndpoint;
  } else if (!assignUserCodesPath) {
    return ErrorMessages.MissingEndpoint;
  }
}

function getResponseData(response: RequestResponse, url: string) {
  if (response.data && Object.keys(response.data).length >= 1) {
    const responseData = response.data;
    const codes = responseData.data;
    const code = responseData.data.length ? responseData.data[0].code : responseData.data.code;
    const trackingUrl = url.replace('!!!CODE!!!', code);
    return {
      codes,
      code,
      trackingUrl,
    };
  }
}

/**
 * Secrets for code redeemed
 */

/**
 *  environment values for code redeemed for setting urls
 */
const codeRedeemedHost = process.env.CODES_REDEEMED_HOST || '';
const codeRedeemedEnvironment = process.env.ENVIRONMENT || '';
const codeRedeemedPath = process.env.CODE_REDEEMED_PATH || '';
const assignUserCodesPath = process.env.CODE_ASSIGNED_REDEEMED_PATH || '';

type Secrets = {
  codeRedeemedData: string;
  codeRedeemedPassword: string;
  assignUserCodesData: string;
  assignUserCodesPassword: string;
};

export const handler = async (event: IAPIGatewayEvent): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('POST Spotify Proxy Input', { event });
  try {
    const client = new SecretsManagerClient({
      region: 'eu-west-2',
    });
    const awsResponse = await client.send(
      new GetSecretValueCommand({
        SecretId: 'blc-mono-redemptions/NewVaultSecrets',
      }),
    );

    const codeRedemptionSecrets = awsResponse.SecretString ? JSON.parse(awsResponse.SecretString) : {};

    const secrets: Secrets = {
      ...codeRedemptionSecrets,
    };

    const codeEndpoint = `${codeRedeemedHost}/${codeRedeemedEnvironment}/${codeRedeemedPath}`;
    const validationMessage = validateEnvironmentVariables({
      codeRedeemedHost,
      codeRedeemedEnvironment,
      codeRedeemedPath,
      assignUserCodesPath,
    });
    if (validationMessage) {
      return Response.Error(new Error('Invalid validation for environment variables'));
    }
    const { platform, companyId, offerId, memberId, url } = JSON.parse(event.body);
    const key = generateKey(secrets.codeRedeemedData, secrets.codeRedeemedPassword);
    const payload = { brand: platform, companyId, offerId, userId: memberId };
    const response: RequestResponse | undefined = await httpRequest({
      method: 'POST',
      headers: {
        authorization: key,
      },
      data: payload,
      endpoint: codeEndpoint,
    });

    if (response) {
      const responseData = getResponseData(response, url);

      if (!responseData) {
        return Response.NotFound({ message: 'Not found' });
      }

      const { codes, code, trackingUrl } = responseData;
      if (codes.length) {
        return Response.OK({ message: 'Success', data: { trackingUrl, code } });
      }

      const assignUserEndpont = `${codeRedeemedHost}/${codeRedeemedEnvironment}/${assignUserCodesPath}`;
      const assignUserKey = generateKey(secrets.assignUserCodesData, secrets.assignUserCodesPassword);
      const assignUserResponse: RequestResponse | undefined = await httpRequest({
        method: 'POST',
        headers: {
          authorization: assignUserKey,
        },
        data: payload,
        endpoint: assignUserEndpont,
      });
      if (assignUserResponse) {
        const assignedUserResponseData = getResponseData(assignUserResponse, url);

        if (!assignedUserResponseData) {
          return Response.NotFound({ message: 'Not found' });
        }

        const { code: assignUserCode, trackingUrl: assignUserTrackingUrl } = assignedUserResponseData;

        return Response.OK({
          message: 'Success',
          data: {
            trackingUrl: assignUserTrackingUrl,
            code: assignUserCode,
            dwh: true,
          },
        });
      }
    }
    return Response.Error(new Error('Internal service error'));
  } catch (error) {
    logger.error('Error while creating Spotify code.', { error });
    return Response.Error(new Error('Error while creating Spotify code.'));
  }
};
