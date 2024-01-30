import { Logger } from '@aws-lambda-powertools/logger';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { APIGatewayEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

import { getEnv } from '@blc-mono/core/utils/getEnv';

import { httpRequest, RequestResponse } from '../../../../core/src/utils/fetch/httpRequest';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { EnvironmentKeys } from '../../constants/environment';
import { generateKey } from '../../helpers/newVaultAuth';

export interface IAPIGatewayEvent extends APIGatewayEvent {
  body: string;
}
const service: string = process.env.service as string;
const logger = new Logger({ serviceName: `${service}-post` });

interface ResponseData {
  codes: Array<{ code: number }>;
  code: number;
  trackingUrl: string;
}

function getResponseData(response: RequestResponse, url: string): ResponseData | undefined {
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
interface Secrets {
  codeRedeemedData: string;
  codeRedeemedPassword: string;
  assignUserCodesData: string;
  assignUserCodesPassword: string;
}

export const handler = async (event: IAPIGatewayEvent): Promise<APIGatewayProxyStructuredResultV2> => {
  logger.info('POST Spotify Proxy Input', { event });

  // environment values for code redeemed for setting urls
  const codesRedeemedHost = getEnv(EnvironmentKeys.CODES_REDEEMED_HOST);
  const codesRedeemedEnvironment = getEnv(EnvironmentKeys.CODES_REDEEMED_ENVIRONMENT);
  const codeRedeemedPath = getEnv(EnvironmentKeys.CODE_REDEEMED_PATH);
  const codeAssignedRedeemedPath = getEnv(EnvironmentKeys.CODE_ASSIGNED_REDEEMED_PATH);

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

    const codeEndpoint = `${codesRedeemedHost}/${codesRedeemedEnvironment}/${codeRedeemedPath}`;
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

      const assignUserEndpont = `${codesRedeemedHost}/${codesRedeemedEnvironment}/${codeAssignedRedeemedPath}`;
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
