import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

export interface ICreateRedemptionConfigService {
  createRedemptionConfig(request: Record<string, unknown>): Promise<Record<string, unknown>>;
}

export class CreateRedemptionConfigService implements ICreateRedemptionConfigService {
  static readonly key = 'CreateRedemptionConfigService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public createRedemptionConfig(request: Record<string, unknown>): Promise<Record<string, unknown>> {
    if (request.error) {
      this.logger.debug({ message: 'It did not work' });
      return Promise.resolve({
        kind: 'Error',
        data: {
          message: 'error',
        },
      });
    }
    return Promise.resolve({
      kind: 'Ok',
      data: {},
    });
  }
}
