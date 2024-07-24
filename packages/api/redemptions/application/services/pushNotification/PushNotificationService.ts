import { RedemptionTypes } from '@blc-mono/core/constants/redemptions';
import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';

import { IPushNotificationRepository, PushNotificationRepository } from '../../repositories/PushNotificationRepository';

export interface IPushNotificationService {
  sendRedemptionPushNotification(
    companyName: string,
    brazeExternalUserId: string,
    redemptionType: RedemptionTypes,
    url?: string,
  ): Promise<void>;
}

export class PushNotificationService implements IPushNotificationService {
  static key = 'PushNotificationService' as const;
  static inject = [Logger.key, PushNotificationRepository.key] as const;

  constructor(
    private logger: ILogger,
    private pushNotificationRepository: IPushNotificationRepository,
  ) {}

  public async sendRedemptionPushNotification(
    companyName: string,
    brazeExternalUserId: string,
    redemptionType: RedemptionTypes,
    url?: string,
  ): Promise<void> {
    await this.pushNotificationRepository.sendRedemptionPushNotification(
      companyName,
      brazeExternalUserId,
      redemptionType,
      url,
    );
  }
}
