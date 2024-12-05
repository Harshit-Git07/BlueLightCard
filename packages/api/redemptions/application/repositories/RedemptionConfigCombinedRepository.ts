import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { RedemptionConfigRepository } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { VaultBatchesRepository } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultsRepository } from '@blc-mono/redemptions/application/repositories/VaultsRepository';

import { BallotsRepository } from './BallotsRepository';

export interface IRedemptionConfigCombinedRepository {
  deleteRedemptionsFromDatabaseByOfferIds(offerIds: string[]): Promise<void>;
  deleteRedemptionFromDatabaseByOfferId(offerId: string): Promise<void>;
  deleteVaultsByRedemptionId(redemptionId: string): Promise<void>;
  deleteBallotByRedemptionId(redemptionId: string): Promise<void>;
}

export class RedemptionConfigCombinedRepository implements IRedemptionConfigCombinedRepository {
  static readonly key = 'RedemptionConfigCombinedRepository' as const;

  static readonly inject = [
    RedemptionConfigRepository.key,
    VaultsRepository.key,
    VaultBatchesRepository.key,
    GenericsRepository.key,
    BallotsRepository.key,
  ] as const;

  constructor(
    private readonly redemptionConfigRepository: RedemptionConfigRepository,
    private readonly vaultsRepository: VaultsRepository,
    private readonly vaultBatchesRepository: VaultBatchesRepository,
    private readonly genericsRepository: GenericsRepository,
    private readonly ballotsRepository: BallotsRepository,
  ) {}

  public async deleteRedemptionsFromDatabaseByOfferIds(offerIds: string[]): Promise<void> {
    for (const offerId of offerIds) {
      await this.deleteRedemptionFromDatabaseByOfferId(offerId);
    }
  }

  public async deleteRedemptionFromDatabaseByOfferId(offerId: string) {
    const redemption = await this.redemptionConfigRepository.findOneByOfferId(offerId);

    if (redemption) {
      const redemptionId = redemption.id;

      await this.deleteVaultsByRedemptionId(redemptionId);
      await this.deleteBallotByRedemptionId(redemptionId);

      await this.genericsRepository.deleteByRedemptionId(redemptionId);
      await this.redemptionConfigRepository.deleteById(redemptionId);
    }
  }

  public async deleteVaultsByRedemptionId(redemptionId: string) {
    const vault = await this.vaultsRepository.findOneByRedemptionId(redemptionId);

    if (vault) {
      const vaultId = vault.id;

      await this.vaultBatchesRepository.deleteByVaultId(vaultId);
      await this.vaultsRepository.deleteById(vaultId);
    }
  }

  public async deleteBallotByRedemptionId(redemptionId: string) {
    const ballot = await this.ballotsRepository.findOneByRedemptionId(redemptionId);

    if (ballot) {
      await this.ballotsRepository.deleteById(ballot.id);
    }
  }
}
