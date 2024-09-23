import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PostCallbackModel } from '@blc-mono/redemptions/libs/models/postCallback';

import { DwhRepository, IDwhRepository } from '../../repositories/DwhRepository';

export type ICallbackResponse = {
  kind: 'NoContent' | 'Error';
};

export interface ICallbackService {
  handle(data: PostCallbackModel): Promise<ICallbackResponse>;
}

export class CallbackService implements ICallbackService {
  static readonly key = 'CallbackService';
  static readonly inject = [Logger.key, DwhRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private dwhRepository: IDwhRepository,
  ) {}

  public async handle(data: PostCallbackModel): Promise<ICallbackResponse> {
    const { code, currency, offerId, orderValue, redeemedAt } = data;
    try {
      await this.dwhRepository.logCallbackVaultRedemption(offerId, code, orderValue, currency, redeemedAt);
      return {
        kind: 'NoContent',
      };
    } catch (error) {
      this.logger.error({
        message: 'Callback Admin API - Error logging callback vault redemption',
        context: data,
        error,
      });
      return {
        kind: 'Error',
      };
    }
  }
}
