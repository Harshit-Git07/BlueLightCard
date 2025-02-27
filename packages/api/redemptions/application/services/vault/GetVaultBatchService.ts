import { IVaultBatchesRepository, VaultBatchesRepository } from '../../repositories/VaultBatchesRepository';
import { IVaultsRepository, VaultsRepository } from '../../repositories/VaultsRepository';

type GetVaultBatchData = {
  batchId: string;
  vaultId: string;
  expiry: string;
  created: string;
  codesRemaining: number;
};

type GetVaultBatchSuccess = {
  kind: 'Ok';
  data: GetVaultBatchData[];
};

type GetVaultBatchNotFound = {
  kind: 'VaultNotFound';
  data?: never;
};

export type GetVaultBatchResult = GetVaultBatchSuccess | GetVaultBatchNotFound;

export interface IGetVaultBatchService {
  getVaultBatch(vaultId: string): Promise<GetVaultBatchResult>;
}

export default class GetVaultBatchService {
  static readonly key = 'GetVaultBatchService';
  static readonly inject = [VaultsRepository.key, VaultBatchesRepository.key] as const;

  constructor(
    private readonly vaultsRepository: IVaultsRepository,
    private readonly vaultBatchesRepository: IVaultBatchesRepository,
  ) {}

  public async getVaultBatch(vaultId: string): Promise<GetVaultBatchResult> {
    const vault = await this.vaultsRepository.findOneById(vaultId);

    if (!vault) {
      return { kind: 'VaultNotFound' };
    }

    const vaultBatches = await this.vaultBatchesRepository.findByVaultId(vaultId);
    const getVaultBatchData: GetVaultBatchData[] = await Promise.all(
      vaultBatches.map(async (vaultBatch) => {
        return {
          batchId: vaultBatch.id,
          vaultId: vaultBatch.vaultId,
          expiry: vaultBatch.expiry.toISOString(),
          created: vaultBatch.created.toISOString(),
          codesRemaining: await this.vaultBatchesRepository.getCodesRemaining(vaultBatch.id),
        };
      }),
    );

    getVaultBatchData.sort((a, b) => a.created.localeCompare(b.created));

    return {
      kind: 'Ok',
      data: getVaultBatchData,
    };
  }
}
