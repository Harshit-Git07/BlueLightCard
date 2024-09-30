import { z } from 'zod';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PatchRedemptionModelRequestBody } from '@blc-mono/redemptions/application/controllers/adminApiGateway/redemptionConfig/UpdateRedemptionConfigController';
import { PatchRedemptionModel } from '@blc-mono/redemptions/libs/models/PatchRedemptionModel';

import { RedemptionConfigRepository } from '../../repositories/RedemptionConfigRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';
export type UpdateRedemptionConfigResult =
  | {
      kind: 'Ok';
      data: RedemptionConfig;
    }
  | {
      kind: 'Error' | 'RedemptionNotFound';
    };

export type PatchRedemptionModelResponse = z.infer<typeof PatchRedemptionModel>;

export interface IUpdateRedemptionConfigService {
  updateRedemptionConfig(data: PatchRedemptionModelRequestBody): Promise<UpdateRedemptionConfigResult>;
}

export class UpdateRedemptionConfigService implements IUpdateRedemptionConfigService {
  static readonly key = 'UpdateRedemptionConfigService';
  static readonly inject = [Logger.key, RedemptionConfigRepository.key, RedemptionConfigTransformer.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepository: RedemptionConfigRepository,
    private readonly redemptionConfigTransformer: RedemptionConfigTransformer,
  ) {}

  public async updateRedemptionConfig(data: PatchRedemptionModelRequestBody): Promise<UpdateRedemptionConfigResult> {
    try {
      const redemption = await this.redemptionsRepository.findOneById(data.id);

      if (!redemption) {
        this.logger.error({
          message: 'Update Redemption Config - Redemption not found for given ID',
          context: {
            data,
          },
        });
        return {
          kind: 'RedemptionNotFound',
        };
      }

      this.logger.info({
        message: 'Update Redemption Config - Updating redemption',
        context: {
          data,
        },
      });
      const updatedRedemption = await this.redemptionsRepository.updateOneById(data.id, data);

      if (!updatedRedemption) {
        this.logger.error({
          message: 'Update Redemption Config - Redemption not updated',
          context: {
            data,
          },
        });
        return {
          kind: 'Error',
        };
      }
      return {
        kind: 'Ok',
        data: this.redemptionConfigTransformer.transformToRedemptionConfig({
          redemptionConfigEntity: updatedRedemption,
          genericEntity: null,
          vaultEntity: null,
          vaultBatchEntities: [],
        }),
      };
    } catch (error) {
      this.logger.error({
        message: 'Update Redemption Config - Error updating redemption',
        context: {
          data,
          error,
        },
      });
      return {
        kind: 'Error',
      };
    }
  }
}
