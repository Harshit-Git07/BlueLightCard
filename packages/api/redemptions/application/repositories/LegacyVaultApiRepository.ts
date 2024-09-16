import aesjs from 'aes-js';
import { randomBytes } from 'crypto';
import * as pkcs7 from 'pkcs7';
import z from 'zod';

import { Brand } from '@blc-mono/core/schemas/common';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionsStackEnvironmentKeys } from '@blc-mono/redemptions/infrastructure/constants/environment';
import { ISecretsManager, SecretsManager } from '@blc-mono/redemptions/libs/SecretsManager/SecretsManager';

enum ApisLambdaScripts {
  RETRIEVE_ALL_VAULTS = 'RETRIEVE_ALL_VAULTS',
  CHECK_AMOUNT_ISSUED = 'CHECK_AMOUNT_ISSUED',
  ASSIGN_USER_CODES = 'ASSIGN_USER',
  CODES_REDEEMED = 'CODES_REDEEMED',
  VIEW_VAULT_BATCHES = 'VIEW_VAULT_BATCHES',
  CHECK_VAULT_STOCK = 'CHECK_VAULT_STOCK',
}

export const GetNumberOfCodesResponseSchema = z.object({
  // The number of codes issued to the member
  data: z.number(),
});
export type GetNumberOfCodesResponse = z.infer<typeof GetNumberOfCodesResponseSchema>;

export const AssignCodeToMemberDataSchema = z.object({
  code: z.string(),
});
export const AssignCodeToMemberResponseSchema = z.object({
  data: AssignCodeToMemberDataSchema,
});
export const AssignCodeToMemberWithErrorHandlingResponseSchema = z.object({
  success: z.boolean(),
  data: AssignCodeToMemberDataSchema.optional(),
  message: z.string().optional(),
});
export type AssignCodeToMemberData = z.infer<typeof AssignCodeToMemberDataSchema>;
export type AssignCodeToMemberResponse = z.infer<typeof AssignCodeToMemberResponseSchema>;

export const RedeemedCodeSchema = z.object({
  code: z.string(),
});
export const RedeemedCodesResponseSchema = z.object({
  data: z.array(RedeemedCodeSchema),
});
export type RedeemedCode = z.infer<typeof RedeemedCodeSchema>;
export type CodesRedeemedResponse = z.infer<typeof RedeemedCodesResponseSchema>;

export type AssignCodeTeMemberSpotifyData = AssignCodeToMemberData & {
  trackingUrl: string;
};

export const ViewVaultBatchesDataSchema = z.record(
  z.object({
    // Key of record = Batch Id
    expires: z.string(), // 2024-01-01 23:59:59
    dateAdded: z.string(), // 2024-01-01 23:59:59
    filename: z.string(), // something.csv
  }),
);
export const ViewVaultBatchesResponseSchema = z.object({
  success: z.boolean(),
  data: z.union([ViewVaultBatchesDataSchema, z.array(z.null())]),
});
export type ViewVaultBatchesData = z.infer<typeof ViewVaultBatchesDataSchema>;
export type ViewVaultBatchesResponse = z.infer<typeof ViewVaultBatchesResponseSchema>;

export const CheckVaultStockDataSchema = z.number(); // Number of codes remaining in the batch
export const CheckVaultStockResponseSchema = z.object({
  success: z.boolean(),
  data: CheckVaultStockDataSchema,
});
export type CheckVaultStockData = z.infer<typeof CheckVaultStockDataSchema>;
export type CheckVaultStockResponse = z.infer<typeof CheckVaultStockResponseSchema>;

export const LegacyVaultDataSchema = z.object({
  companyId: z.any(),
  offerId: z.any(),
  linkId: z.any(),
});
export const VaultDataResponseSchema = z.object({
  data: z.array(LegacyVaultDataSchema),
});
export type VaultDataResponse = z.infer<typeof VaultDataResponseSchema>;
export type LegacyVaultData = VaultDataResponse['data'][number];

export type VaultItem = {
  offerId: number;
  companyId: number;
};

const platformToBrandMap: Record<Brand, string> = {
  BLC_UK: 'BLC',
  BLC_AU: 'BLC',
  DDS_UK: 'DDS',
};

export const VaultSecretsSchema = z.object({
  codeRedeemedData: z.string(),
  codeRedeemedPassword: z.string(),
  assignUserCodesData: z.string(),
  assignUserCodesPassword: z.string(),
  checkAmountIssuedData: z.string(),
  checkAmountIssuedPassword: z.string(),
  retrieveAllVaultsData: z.string(),
  retrieveAllVaultsPassword: z.string(),
  viewVaultBatchesData: z.string(),
  viewVaultBatchesPassword: z.string(),
  checkVaultStockData: z.string(),
  checkVaultStockPassword: z.string(),
});
export type VaultSecrets = z.infer<typeof VaultSecretsSchema>;

export interface ILegacyVaultApiRepository {
  findVaultsRelatingToLinkId(linkId: number): Promise<VaultItem[]>;
  getNumberOfCodesIssuedByMember(memberId: string, companyId: number, offerId: number): Promise<number>;
  getCodesRedeemed(companyId: number, offerId: number, memberId: string): Promise<string[]>;
  assignCodeToMember(memberId: string, companyId: number, offerId: number): Promise<AssignCodeToMemberData>;
  assignCodeToMemberWithErrorHandling(
    memberId: string,
    companyId: number,
    offerId: number,
  ): Promise<{ kind: 'Ok'; data: AssignCodeToMemberData } | { kind: 'NoCodesAvailable'; data?: never }>;
  viewVaultBatches(offerId: number, companyId: number): Promise<ViewVaultBatchesData>;
  checkVaultStock(batchNo: string, offerId: number, companyId: number): Promise<CheckVaultStockData>;
}

export class LegacyVaultApiRepository implements ILegacyVaultApiRepository {
  static readonly key = 'LegacyVaultApiRepository' as const;
  static readonly inject = [Logger.key, SecretsManager.key] as const;

  private readonly host: string = getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_HOST);
  private readonly environment: string = getEnv(RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ENVIRONMENT);
  private readonly apiPaths: Record<ApisLambdaScripts, string> = {
    [ApisLambdaScripts.RETRIEVE_ALL_VAULTS]: getEnv(
      RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_RETRIEVE_ALL_VAULTS_PATH,
    ),
    [ApisLambdaScripts.CHECK_AMOUNT_ISSUED]: getEnv(
      RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_AMOUNT_ISSUED_PATH,
    ),
    [ApisLambdaScripts.ASSIGN_USER_CODES]: getEnv(
      RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_ASSIGN_USER_CODES_PATH,
    ),
    [ApisLambdaScripts.CODES_REDEEMED]: getEnv(
      RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CODES_REDEEMED_PATH,
    ),
    [ApisLambdaScripts.VIEW_VAULT_BATCHES]: getEnv(
      RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_VIEW_VAULT_BATCHES_PATH,
    ),
    [ApisLambdaScripts.CHECK_VAULT_STOCK]: getEnv(
      RedemptionsStackEnvironmentKeys.REDEMPTIONS_LAMBDA_SCRIPTS_CHECK_VAULT_STOCK_PATH,
    ),
  };
  private brand: Brand = getBrandFromEnv();

  constructor(
    private readonly logger: ILogger,
    private readonly awsSecretsMangerClient: ISecretsManager,
  ) {}

  public async findVaultsRelatingToLinkId(linkId: number): Promise<VaultItem[]> {
    const brand = platformToBrandMap[this.brand];
    const endpoint = this.getRequestEndpoint(ApisLambdaScripts.RETRIEVE_ALL_VAULTS);
    const credentials = await this.getLegacyVaultCredentials();
    const key = this.generateKey(credentials.retrieveAllVaultsData, credentials.retrieveAllVaultsPassword);

    const response = await fetch(`${endpoint}?brand=${brand}`, {
      method: 'GET',
      headers: {
        authorization: key,
      },
    });

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Error retrieving vaults', {
        linkId,
        brand,
      });
    }

    const body = await response.json();
    const vaults = VaultDataResponseSchema.parse(body).data;
    const affectedVaults = vaults.filter(({ linkId: vaultLinkId }) => Number(vaultLinkId) === linkId);

    return affectedVaults.map((item) => ({
      offerId: item.offerId,
      companyId: item.companyId,
    }));
  }

  public async getNumberOfCodesIssuedByMember(memberId: string, companyId: number, offerId: number): Promise<number> {
    const endpoint = this.getRequestEndpoint(ApisLambdaScripts.CHECK_AMOUNT_ISSUED);
    const credentials = await this.getLegacyVaultCredentials();
    const key = this.generateKey(credentials.checkAmountIssuedData, credentials.checkAmountIssuedPassword);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        userId: memberId,
        brand: 'BLC',
        companyId,
        offerId,
      }),
      headers: {
        authorization: key,
      },
    });

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Error retrieving number of codes issued', {
        memberId,
        companyId,
        offerId,
      });
    }

    const data = await response.json();
    return GetNumberOfCodesResponseSchema.parse(data).data;
  }

  public async getCodesRedeemed(companyId: number, offerId: number, memberId: string): Promise<string[]> {
    const brand = platformToBrandMap[this.brand];
    const endpoint = this.getRequestEndpoint(ApisLambdaScripts.CODES_REDEEMED);
    const credentials = await this.getLegacyVaultCredentials();
    const key = this.generateKey(credentials.codeRedeemedData, credentials.codeRedeemedPassword);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({ brand, companyId, offerId, userId: memberId }),
      headers: {
        authorization: key,
      },
    });

    if (!response.ok) {
      return this.handleErrorResponse(response, 'Error retrieving redeemed codes', {
        memberId,
        companyId,
        offerId,
        brand,
      });
    }

    const data = await response.json();
    return RedeemedCodesResponseSchema.parse(data).data.map((item) => item.code);
  }

  public async assignCodeToMember(
    memberId: string,
    companyId: number,
    offerId: number,
  ): Promise<AssignCodeToMemberData> {
    const brand = platformToBrandMap[this.brand];
    const endpoint = this.getRequestEndpoint(ApisLambdaScripts.ASSIGN_USER_CODES);
    const credentials = await this.getLegacyVaultCredentials();
    const key = this.generateKey(credentials.assignUserCodesData, credentials.assignUserCodesPassword);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        userId: memberId,
        brand,
        companyId,
        offerId,
      }),
      headers: {
        authorization: key,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return AssignCodeToMemberResponseSchema.parse(data).data;
    }
    return this.handleErrorResponse(response, 'Error while assigning code to member', {
      memberId,
      companyId,
      offerId,
    });
  }

  public async viewVaultBatches(offerId: number, companyId: number): Promise<ViewVaultBatchesData> {
    const brand = platformToBrandMap[this.brand];
    const endpoint = this.getRequestEndpoint(ApisLambdaScripts.VIEW_VAULT_BATCHES);
    const credentials = await this.getLegacyVaultCredentials();
    const key = this.generateKey(credentials.viewVaultBatchesData, credentials.viewVaultBatchesPassword);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        companyId,
        offerId,
        brand,
      }),
      headers: {
        authorization: key,
      },
    });
    const data = (await response.json()) as ViewVaultBatchesResponse;
    const parsedData = ViewVaultBatchesResponseSchema.parse(data);
    if (response.ok && !Array.isArray(parsedData.data)) {
      return parsedData.data;
    }
    return this.handleErrorResponse(response, 'Error while viewing vault batches', {
      companyId,
      offerId,
      brand,
    });
  }

  public async checkVaultStock(batchNo: string, offerId: number, companyId: number): Promise<CheckVaultStockData> {
    const brand = platformToBrandMap[this.brand];
    const endpoint = this.getRequestEndpoint(ApisLambdaScripts.CHECK_VAULT_STOCK);
    const credentials = await this.getLegacyVaultCredentials();
    const key = this.generateKey(credentials.checkVaultStockData, credentials.checkVaultStockPassword);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        brand,
        batchNo,
        companyId,
        offerId,
      }),
      headers: {
        authorization: key,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return CheckVaultStockResponseSchema.parse(data).data;
    }
    return this.handleErrorResponse(response, 'Error while checking vault stock', {
      batchNo,
      offerId,
      companyId,
      brand,
    });
  }

  public async assignCodeToMemberWithErrorHandling(
    memberId: string,
    companyId: number,
    offerId: number,
  ): Promise<{ kind: 'Ok'; data: AssignCodeToMemberData } | { kind: 'NoCodesAvailable'; data?: never }> {
    const brand = platformToBrandMap[this.brand];
    const endpoint = this.getRequestEndpoint(ApisLambdaScripts.ASSIGN_USER_CODES);
    const credentials = await this.getLegacyVaultCredentials();
    const key = this.generateKey(credentials.assignUserCodesData, credentials.assignUserCodesPassword);
    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        userId: memberId,
        brand,
        companyId,
        offerId,
      }),
      headers: {
        authorization: key,
      },
    });
    const data = (await response.json()) as {
      success: boolean;
      message?: string;
      data?: AssignCodeToMemberData;
    };
    const parsedData = AssignCodeToMemberWithErrorHandlingResponseSchema.parse(data);

    if (response.status === 200 && parsedData?.data?.code) {
      return { kind: 'Ok', data: parsedData.data };
    }
    if (response.status === 400 && parsedData?.message === 'No codes available') {
      return { kind: 'NoCodesAvailable' };
    }
    return this.handleErrorResponse(response, 'Error while assigning code to member', {
      memberId,
      companyId,
      offerId,
    });
  }

  // ================= Helpers =================

  private async handleErrorResponse(
    response: Response,
    message: string,
    context?: Record<string, unknown>,
  ): Promise<never> {
    this.logger.error({
      message: `${message} (API request failed)`,
      context: {
        ...context,
        response: {
          status: response.status,
          data: await response.text(),
        },
      },
    });
    throw new Error(`${message} (unexpected status code: ${response.status})`);
  }

  private getLegacyVaultCredentials = async (): Promise<VaultSecrets> => {
    const awsResponse = await this.awsSecretsMangerClient.getSecretValueJson('blc-mono-redemptions/NewVaultSecrets');
    return VaultSecretsSchema.parse(awsResponse);
  };

  private generateKey(data: string, password: string): string {
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

  private getRequestEndpoint(api: ApisLambdaScripts): string {
    const path = this.apiPaths[api];
    return `${this.host}/${this.environment}/${path}`;
  }
}
