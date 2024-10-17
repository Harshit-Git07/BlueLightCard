import { ClientType } from '@blc-mono/core/schemas/domain';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import {
  IRedemptionConfigRepository,
  RedemptionConfigEntity,
  RedemptionConfigRepository,
} from '../../repositories/RedemptionConfigRepository';
import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';

export type RedemptionDetailsResult =
  | {
      kind: 'Ok';
      data: {
        redemptionType: RedemptionType;
      };
    }
  | {
      kind: 'RedemptionNotFound';
    };

export interface IRedemptionDetailsService {
  getRedemptionDetails(offerId: string, memberId: string, clientType: ClientType): Promise<RedemptionDetailsResult>;
}

export class RedemptionDetailsService implements IRedemptionDetailsService {
  static readonly key = 'RedemptionDetailsService';
  static readonly inject = [Logger.key, RedemptionsEventsRepository.key, RedemptionConfigRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly redemptionConfigRepository: IRedemptionConfigRepository,
  ) {}

  public async getRedemptionDetails(
    offerId: string,
    memberId: string,
    clientType: ClientType,
  ): Promise<RedemptionDetailsResult> {
    this.logger.info({
      message: 'CLIENT TYPE',
      context: {
        clientType,
      },
    });

    const redemptionConfigEntity: RedemptionConfigEntity | null =
      await this.redemptionConfigRepository.findOneByOfferId(offerId);

    if (!redemptionConfigEntity) {
      return {
        kind: 'RedemptionNotFound',
      };
    }

    await this.redemptionsEventsRepository
      .publishMemberRetrievedRedemptionDetailsEvent({
        memberDetails: {
          memberId: memberId,
        },
        redemptionDetails: {
          redemptionType: redemptionConfigEntity.redemptionType,
          offerId: offerId,
          companyId: redemptionConfigEntity.companyId,
          clientType: clientType,
        },
      })
      .catch((error) => {
        this.logger.error({
          message: '[UNHANDLED ERROR] Error while publishing member retrieved redemption details event',
          error,
        });
      });

    return {
      kind: 'Ok',
      data: {
        redemptionType: redemptionConfigEntity.redemptionType,
      },
    };
  }
}
