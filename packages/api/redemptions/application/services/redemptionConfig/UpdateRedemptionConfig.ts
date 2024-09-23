import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PatchRedemptionModelRequest } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';

export type UpdateRedemptionConfigResult = {
  kind: 'Ok' | 'Error';
  data: Record<string, unknown>;
};

export interface IUpdateRedemptionConfigService {
  updateRedemptionConfig(request: Record<string, unknown>): Promise<UpdateRedemptionConfigResult>;
}

export class UpdateRedemptionConfigService implements IUpdateRedemptionConfigService {
  static readonly key = 'UpdateRedemptionConfigService';
  static readonly inject = [Logger.key] as const;

  constructor(private readonly logger: ILogger) {}

  public updateRedemptionConfig(request: PatchRedemptionModelRequest): Promise<UpdateRedemptionConfigResult> {
    if (!request.body) {
      return Promise.resolve({
        kind: 'Error',
        data: {
          message: 'error',
        },
      });
    }
    return Promise.resolve({
      kind: 'Ok',
      data: {
        message: 'success',
      },
    });
  }
}
