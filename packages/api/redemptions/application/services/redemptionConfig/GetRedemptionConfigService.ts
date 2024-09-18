import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

export type RedemptionConfigResult =
  | {
      kind: 'Ok';
      data: {
        offerId: string;
      };
    }
  | {
      kind: 'RedemptionNotFound';
    }
  | {
      kind: 'Error';
    };

export interface IGetRedemptionConfigService {
  getRedemption(offerId: string): RedemptionConfigResult;
}

export class GetRedemptionConfigService implements IGetRedemptionConfigService {
  static readonly key = 'RedemptionService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public getRedemption(offerId: string): RedemptionConfigResult {
    this.logger.info({
      message: 'offerId',
      context: {
        offerId,
      },
    });

    return {
      kind: 'Ok',
      data: {
        offerId: offerId,
      },
    };
  }
}
