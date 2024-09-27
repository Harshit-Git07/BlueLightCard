import { z, ZodError } from 'zod';

import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { PostRedemptionConfigModel } from '@blc-mono/redemptions/libs/models/postRedemptionConfig';

import { RedemptionConfigRepository } from '../../repositories/RedemptionConfigRepository';
import { RedemptionConfig, RedemptionConfigTransformer } from '../../transformers/RedemptionConfigTransformer';

type CreateRedemptionResponse = {
  kind: 'Ok';
  data: RedemptionConfig;
};

type CreateRedemptionSchema = z.infer<typeof PostRedemptionConfigModel>;

export class SchemaValidationError extends Error {
  public name = 'SchemaValidationError';

  constructor(public readonly data: ZodError<CreateRedemptionSchema>) {
    super('Validation Error');
  }
}

export class ServiceError extends Error {
  public name = 'ServiceError';

  constructor(
    public readonly message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export interface ICreateRedemptionConfigService {
  createRedemptionConfig(request: PostRedemptionConfigModel): Promise<CreateRedemptionResponse>;
}

export class CreateRedemptionConfigService implements ICreateRedemptionConfigService {
  static readonly key = 'CreateRedemptionConfigService';
  static readonly inject = [Logger.key, RedemptionConfigRepository.key, RedemptionConfigTransformer.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionConfigRepository: RedemptionConfigRepository,
    private readonly redemptionConfigTransformer: RedemptionConfigTransformer,
  ) {}

  private async validateRequest(request: CreateRedemptionSchema) {
    const result = PostRedemptionConfigModel.safeParse(request);

    if (!result.success) {
      throw new SchemaValidationError(result.error);
    }

    if (await this.redemptionConfigRepository.findOneByOfferId(request.offerId)) {
      throw new ServiceError('The offerId already has a redemption config', 409);
    }

    return result;
  }

  public async createRedemptionConfig(request: CreateRedemptionSchema): Promise<CreateRedemptionResponse> {
    const { data: requestData } = await this.validateRequest(request);

    try {
      const { id: redemptionId } = await this.redemptionConfigRepository.createRedemption(requestData);
      const redemptionConfigEntity = await this.redemptionConfigRepository.findOneById(redemptionId);

      if (!redemptionConfigEntity) {
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
        data: this.redemptionConfigTransformer.transformToRedemptionConfig({
          redemptionConfigEntity: redemptionConfigEntity,
          genericEntity: null,
          vaultEntity: null,
          vaultBatchEntities: [],
        }),
      };
    } catch (e) {
      this.logger.error({ message: 'Error when creating redemption configuration', error: e });
      throw new Error('Error when creating redemption configuration');
    }
  }
}
