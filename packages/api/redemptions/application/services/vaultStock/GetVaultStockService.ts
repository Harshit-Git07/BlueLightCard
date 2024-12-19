import { ILogger, Logger } from '@blc-mono/core/utils/logger';

export interface IGetVaultStockService {
  getVaultStock(): boolean;
}

export class GetVaultStockService implements IGetVaultStockService {
  static readonly key = 'GetVaultStockService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public getVaultStock(): boolean {
    this.logger.info({
      message: 'GetVaultStockService: getVaultStock - under construction',
      context: {
        runTime: new Date().toISOString(),
      },
    });
    return true;
  }
}
