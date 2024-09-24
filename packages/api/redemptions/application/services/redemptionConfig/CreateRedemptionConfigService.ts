import { z, ZodError } from 'zod';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PostRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { RedemptionsRepository } from '../../repositories/RedemptionsRepository';
import { RedemptionConfig, transformToRedemptionConfig } from '../../transformers/RedemptionConfigTransformer';

type CreateRedemptionResponse =
  | {
      kind: 'Error';
      data: { message: string };
    }
  | {
      kind: 'DuplicationError';
      data: { message: string };
    }
  | {
      kind: 'ValidationError';
      data: ZodError<CreateRedemptionSchema>;
    }
  | {
      kind: 'Ok';
      data: RedemptionConfig;
    };

type CreateRedemptionSchema = z.infer<typeof PostRedemptionConfigModel>;

export interface ICreateRedemptionConfigService {
  createRedemptionConfig(request: PostRedemptionConfigModel): Promise<CreateRedemptionResponse>;
}

export class CreateRedemptionConfigService implements ICreateRedemptionConfigService {
  static readonly key = 'CreateRedemptionConfigService';
  static readonly inject = [Logger.key, RedemptionsRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepository: RedemptionsRepository,
  ) {}

  public async createRedemptionConfig(request: CreateRedemptionSchema): Promise<CreateRedemptionResponse> {
    const result = PostRedemptionConfigModel.safeParse(request);

    if (!result.success) {
      return {
        kind: 'ValidationError',
        data: result.error,
      };
    }

    if (await this.redemptionsRepository.findOneByOfferId(request.offerId)) {
      return {
        kind: 'DuplicationError',
        data: { message: 'The offerId already has a redemption config' },
      };
    }

    try {
      const { id: redemptionId } = await this.redemptionsRepository.createRedemption(request);
      const redemptionEntity = await this.redemptionsRepository.findOneById(redemptionId);

      if (!redemptionEntity) {
        this.logger.error({
          message: 'Unable to fetch newly created redemption',
          context: {
            offerId: request.offerId,
            redemptionId,
          },
        });
        throw new Error('Unable to fetch newly created redemption');
      }

      return {
        kind: 'Ok',
        data: transformToRedemptionConfig(redemptionEntity),
      };
    } catch (e) {
      this.logger.error({ message: 'Error when creating redemption configuration', error: e });
      return {
        kind: 'Error',
        data: {
          message: 'Error when creating redemption configuration',
        },
      };
    }
  }
}
