import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { EagleEyeModel, UniqodoModel } from '@blc-mono/redemptions/libs/models/postCallback';

import { DwhRepository, IDwhRepository } from '../../repositories/DwhRepository';

export type ICallbackResponse = {
  kind: 'NoContent' | 'Error';
};

export interface ICallbackService {
  handle(data: UniqodoModel | EagleEyeModel): Promise<ICallbackResponse>;
}

export class CallbackService implements ICallbackService {
  static readonly key = 'CallbackService';
  static readonly inject = [Logger.key, DwhRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly dwhRepository: IDwhRepository,
  ) {}

  public async handle(data: UniqodoModel | EagleEyeModel): Promise<ICallbackResponse> {
    try {
      switch (data.integrationType) {
        case 'uniqodo':
          await this.dwhRepository.logCallbackUniqodoVaultRedemption(data);
          break;
        case 'eagleeye':
          await this.dwhRepository.logCallbackEagleEyeVaultRedemption(data);
          break;
      }
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
