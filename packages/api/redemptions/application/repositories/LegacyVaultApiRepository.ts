import z from 'zod';

import { httpRequest } from '@blc-mono/core/utils/fetch/httpRequest';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { generateKey } from '@blc-mono/redemptions/application/helpers/newVaultAuth';
import { SecretsErrorResponse, SecretsManger } from '@blc-mono/redemptions/libs/SecretsManger/SecretsManger';

interface ILegacyVaultApiRepository {
  getVaultByLinkId(linkId: number, brand: string): Promise<RedemptionUpdateResponse>;
}

export const vaultDataResponse = z.array(
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

export interface vaultSecrets {
  retrieveAllVaultsData: string;
  retrieveAllVaultsPassword: string;
}
interface vaultItem {
  type: string;
  offerId: number;
  companyId: number;
}

export type RedemptionUpdateResponse = { dependentEntities: vaultItem[] } | SecretsErrorResponse;
const parseVaultItems = (data: string) => {
  const items = vaultDataResponse.safeParse(data);
  return items.success ? items.data : [];
};

const isVaultSecrets = (awsSecrets: vaultSecrets | SecretsErrorResponse): awsSecrets is vaultSecrets => {
  const aws = awsSecrets as unknown as vaultSecrets;
  return aws.retrieveAllVaultsData !== undefined && aws.retrieveAllVaultsPassword !== undefined;
};

export class LegacyVaultApiRepository implements ILegacyVaultApiRepository {
  static readonly key = 'LegacyVaultApiRepository' as const;
  static readonly inject = [Logger.key, SecretsManger.key] as const;

  private readonly host: string;
  private readonly path: string;
  private readonly environment: string;

  constructor(private readonly logger: ILogger, private readonly awsSecretsMangerClient: SecretsManger<vaultSecrets>) {
    this.host = getEnv('REDEMPTIONS_RETRIEVE_ALL_VAULTS_HOST');
    this.path = getEnv('REDEMPTIONS_RETRIEVE_ALL_VAULTS_PATH');
    this.environment = getEnv('REDEMPTIONS_RETRIEVE_ALL_ENVIRONMENT');
  }

  public async getVaultByLinkId(linkId: number, brand: string): Promise<RedemptionUpdateResponse> {
    const requestEndpoint = `${this.host}/${this.environment}/${this.path}`;

    const awsResponse = await this.awsSecretsMangerClient.getSecretValue('blc-mono-redemptions/NewVaultSecrets');

    if (!isVaultSecrets(awsResponse)) {
      this.logger.error(awsResponse);
      return awsResponse;
    }

    const key = generateKey(awsResponse.retrieveAllVaultsData, awsResponse.retrieveAllVaultsPassword);

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
    const vaultData = parseVaultItems(data.data);

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
}
