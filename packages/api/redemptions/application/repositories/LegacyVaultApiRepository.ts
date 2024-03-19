import aesjs from 'aes-js';
import { randomBytes } from 'crypto';
import * as pkcs7 from 'pkcs7';
import z from 'zod';

import { exhaustiveCheck } from '@blc-mono/core/utils/exhaustiveCheck';
import { httpRequest, RequestResponse } from '@blc-mono/core/utils/fetch/httpRequest';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { SecretsErrorResponse, SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

type RedemptionUpdateResponse = { dependentEntities: vaultItem[] } | SecretsErrorResponse;

type ResponseData = {
  codes: Array<{ code: number }>;
  code: number;
  trackingUrl: string;
};

export type Secrets = {
  codeRedeemedPassword: string;
  codeRedeemedData: string;
  checkAmountIssuedData: string;
  checkAmountIssuedPassword: string;
  assignUserCodesData: string;
  assignUserCodesPassword: string;
  retrieveAllVaultsData: string;
  retrieveAllVaultsPassword: string;
};

enum ApisLambdaScripts {
  RETRIEVE_ALL_VAULTS = 'RETRIEVE_ALL_VAULTS',
  CHECK_AMOUNT_ISSUED = 'CHECK_AMOUNT_ISSUED',
  ASSIGN_USER_CODES = 'ASSIGN_USER',
  CODE_REDEEMED_PATH = 'CODE_REDEEMED',
}

const vaultDataResponse = z.array(
  z.object({
    terms: z.string(),
    companyId: z.any(),
    companyName: z.string(),
    offerId: z.any(),
    brand: z.string(),
    createdAt: z.string(),
    managerId: z.any(),
    alertBelow: z.number(),
    showQR: z.number(),
    vaultStatus: z.boolean(),
    sk: z.string(),
    linkId: z.any(),
    maxPerUser: z.number(),
    id: z.string(),
  }),
);

interface IGetNumberOfCodesResponse extends RequestResponse {
  data?: number;
}

interface IAssignCodeToMemberResponse extends RequestResponse {
  data?: { linkId: string; vaultId: string; terms: string; code: string };
}

interface ICodeRedeemedResponse extends RequestResponse {
  data?: {
    companyId: unknown;
    offerId: unknown;
    userId: unknown;
  };
}

interface vaultItem {
  type: string;
  offerId: number;
  companyId: number;
}

export interface ILegacyVaultApiRepository {
  getNumberOfCodesIssued(
    memberId: string,
    companyId: number,
    offerId: number,
  ): Promise<IGetNumberOfCodesResponse | undefined>;
  assignCodeToMember(
    memberId: string,
    companyId: number,
    offerId: number,
    brand?: string,
  ): Promise<IAssignCodeToMemberResponse | undefined>;
  getVaultByLinkId(linkId: number, brand: string): Promise<RedemptionUpdateResponse>;
  redeemCode(
    platform: string,
    companyId: number,
    offerId: number,
    memberId: string,
  ): Promise<ICodeRedeemedResponse | undefined>;
  getResponseData(response: RequestResponse, url: string): ResponseData | undefined;
}

export class LegacyVaultApiRepository implements ILegacyVaultApiRepository {
  static readonly key = 'LegacyVaultApiRepository' as const;
  static readonly inject = [Logger.key, SecretsManager.key] as const;

  constructor(private readonly logger: ILogger, private readonly awsSecretsManagerClient: SecretsManager<Secrets>) {}

  public async getVaultByLinkId(linkId: number, brand: string): Promise<RedemptionUpdateResponse> {
    const requestEndpoint = this.getRequestEndpoint(ApisLambdaScripts.RETRIEVE_ALL_VAULTS);

    const secrets = await this.awsSecretsManagerClient.getSecretValue(
      getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER'),
    );

    if (!this.isVaultSecrets(secrets)) {
      this.logger.error({
        message: 'Error while fetching secrets from AWS',
        context: secrets,
      });
      return secrets;
    }

    const key = await this.generateKey(secrets.retrieveAllVaultsData, secrets.retrieveAllVaultsPassword);

    const response = await httpRequest({
      method: 'GET',
      endpoint: `${requestEndpoint}?brand=${brand}`,
      headers: {
        authorization: key,
      },
    });

    if (!response) {
      throw new Error('Error while fetching data from vault');
    }
    const { data } = response;
    const success = data.success;

    if (!success) {
      this.logger.error({ message: 'Error while fetching data from vault', context: data });
      throw new Error('bad response from vault');
    }
    const vaultData = this.parseVaultItems(data.data);

    if (!vaultData.length) {
      return {
        dependentEntities: [],
      };
    }

    const affectedVaults = vaultData.filter(({ linkId: vaultLinkId }) => vaultLinkId === linkId);

    return {
      dependentEntities: affectedVaults.map((item) => ({
        type: 'vault',
        offerId: item.offerId,
        companyId: item.companyId,
      })),
    };
  }

  public async getNumberOfCodesIssued(
    memberId: string,
    companyId: number,
    offerId: number,
  ): Promise<IGetNumberOfCodesResponse | undefined> {
    const requestEndpoint = this.getRequestEndpoint(ApisLambdaScripts.CHECK_AMOUNT_ISSUED);

    const secrets = await this.awsSecretsManagerClient.getSecretValue(
      getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER'),
    );

    if (!this.isVaultSecrets(secrets)) {
      this.logger.error({
        message: 'Error while fetching secrets from AWS',
        context: secrets,
      });
      return undefined;
    }

    // AWS key gen
    const key = await this.generateKey(secrets.checkAmountIssuedData, secrets.checkAmountIssuedPassword);
    return httpRequest({
      method: 'POST',
      data: {
        userId: memberId,
        brand: 'BLC',
        companyId,
        offerId,
      },
      endpoint: requestEndpoint,
      headers: {
        authorization: key,
      },
    });
  }

  public async assignCodeToMember(
    memberId: string,
    companyId: number,
    offerId: number,
    brand?: string,
  ): Promise<IAssignCodeToMemberResponse | undefined> {
    const requestEndpoint = this.getRequestEndpoint(ApisLambdaScripts.ASSIGN_USER_CODES);

    const secrets = await this.awsSecretsManagerClient.getSecretValue(
      getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER'),
    );

    if (!this.isVaultSecrets(secrets)) {
      this.logger.error({
        message: 'Error while fetching secrets from AWS',
        context: secrets,
      });
      return undefined;
    }

    // AWS Key gen
    const key = await this.generateKey(secrets.assignUserCodesData, secrets.assignUserCodesPassword);
    return httpRequest({
      method: 'POST',
      data: {
        userId: memberId,
        brand: brand ?? 'BLC',
        companyId,
        offerId,
      },
      headers: {
        authorization: key,
      },
      endpoint: requestEndpoint,
    });
  }

  public async redeemCode(
    platform: string,
    companyId: number,
    offerId: number,
    memberId: string,
  ): Promise<ICodeRedeemedResponse | undefined> {
    const requestEndpoint = this.getRequestEndpoint(ApisLambdaScripts.CODE_REDEEMED_PATH);

    const secrets = await this.awsSecretsManagerClient.getSecretValue(
      getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_SECRET_MANAGER'),
    );

    if (!this.isVaultSecrets(secrets)) {
      this.logger.error({
        message: 'Error while fetching secrets from AWS',
        context: secrets,
      });
      return undefined;
    }

    const key = await this.generateKey(secrets.codeRedeemedData, secrets.codeRedeemedPassword);

    return httpRequest({
      method: 'POST',
      headers: {
        authorization: key,
      },
      data: { brand: platform, companyId, offerId, userId: memberId },
      endpoint: requestEndpoint,
    });
  }

  // HELPERS

  public getResponseData(response: RequestResponse, url: string): ResponseData | undefined {
    const responseData = response.data;
    if (!responseData || Object.keys(responseData).length < 1) {
      return undefined;
    }
    const codes = responseData.data;
    const code = responseData.data?.length ? responseData.data[0]?.code : responseData.data?.code;
    if (!codes || !code) return undefined;
    const trackingUrl = url?.replace('!!!CODE!!!', code);
    return {
      codes,
      code,
      trackingUrl,
    };
  }

  private async generateKey(data: string, password: string): Promise<string> {
    const dataBytes = aesjs.utils.utf8.toBytes(data);
    const passwordBytes = aesjs.utils.utf8.toBytes(password);
    const ivBytes = randomBytes(16);
    // eslint-disable-next-line new-cap
    const aesCbc = new aesjs.ModeOfOperation.cbc(passwordBytes, ivBytes); // PHP uses AES-128-CBC
    const encryptedBytes = aesCbc.encrypt(pkcs7.pad(dataBytes)); // pad as PHP function is OPENSSL_RAW_DATA (option=1)
    const encHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    const ivHex = aesjs.utils.hex.fromBytes(ivBytes);
    const hex = encHex + ivHex; // concat as PHP code does and lambda-scripts repo breaks out
    const buf = Buffer.from(hex, 'hex');
    return buf.toString('base64');
  }

  private parseVaultItems(data: string) {
    const items = vaultDataResponse.safeParse(data);
    return items.success ? items.data : [];
  }

  private isVaultSecrets(awsSecrets: Secrets | SecretsErrorResponse): awsSecrets is Secrets {
    const aws = awsSecrets as unknown as Secrets;
    const requiredKeys: (keyof Secrets)[] = [
      'codeRedeemedPassword',
      'codeRedeemedData',
      'checkAmountIssuedData',
      'checkAmountIssuedPassword',
      'assignUserCodesData',
      'assignUserCodesPassword',
      'retrieveAllVaultsData',
      'retrieveAllVaultsPassword',
    ];

    return requiredKeys.every((key) => key in aws);
  }

  private getRequestEndpoint(desiredApi: ApisLambdaScripts): string {
    const host = getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_HOST');
    const environment = getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT');
    switch (desiredApi) {
      case ApisLambdaScripts.RETRIEVE_ALL_VAULTS:
        return `${host}/${environment}/${getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH')}`;
      case ApisLambdaScripts.CHECK_AMOUNT_ISSUED:
        return `${host}/${environment}/${getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH')}`;
      case ApisLambdaScripts.ASSIGN_USER_CODES:
        return `${host}/${environment}/${getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH')}`;
      case ApisLambdaScripts.CODE_REDEEMED_PATH:
        return `${host}/${environment}/${getEnv('REDEMPTIONS_LAMBDA_SCRIPTS_CODE_REDEEMED_PATH')}`;
      default:
        exhaustiveCheck(desiredApi);
    }
  }
}
