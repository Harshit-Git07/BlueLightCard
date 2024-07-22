import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { VaultBatchCreatedEvent } from '@blc-mono/redemptions/application/controllers/eventBridge/vaultBatch/VaultBatchCreatedController';

export interface IVaultBatchService {
  vaultBatchCreated(event: VaultBatchCreatedEvent): Promise<void>;
}

export class VaultBatchService implements IVaultBatchService {
  static readonly key = 'AdminEmailService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public async vaultBatchCreated(event: VaultBatchCreatedEvent): Promise<void> {
    /* todo
     * This file is a stub and will be developed on ticket: https://bluelightcard.atlassian.net/browse/TR-630
     */
  }
}
