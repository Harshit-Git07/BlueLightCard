import { ClientType } from '@blc-mono/core/schemas/domain';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { RedemptionType } from '@blc-mono/redemptions/libs/database/schema';

import {
  IRedemptionsEventsRepository,
  RedemptionsEventsRepository,
} from '../../repositories/RedemptionsEventsRepository';
import { IRedemptionsRepository, RedemptionsRepository } from '../../repositories/RedemptionsRepository';

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
  getRedemptionDetails(offerId: number, memberId: string, clientType: ClientType): Promise<RedemptionDetailsResult>;
}

export class RedemptionDetailsService implements IRedemptionDetailsService {
  static readonly key = 'RedemptionDetailsService';
  static readonly inject = [Logger.key, RedemptionsEventsRepository.key, RedemptionsRepository.key] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsEventsRepository: IRedemptionsEventsRepository,
    private readonly redemptionsRepository: IRedemptionsRepository,
  ) {}

  public async getRedemptionDetails(
    offerId: number,
    memberId: string,
    clientType: ClientType,
  ): Promise<RedemptionDetailsResult> {
    this.logger.info({
      message: 'CLIENT TYPE',
      context: {
        clientType,
      },
    });
    const redemption = await this.redemptionsRepository.findOneByOfferId(offerId);

    if (!redemption) {
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
          redemptionType: redemption.redemptionType,
          offerId: offerId,
          companyId: redemption.companyId,
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
        redemptionType: redemption.redemptionType,
      },
    };
  }
}
