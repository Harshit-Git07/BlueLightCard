import { PaymentObjectEventDetail } from '@blc-mono/core/schemas/payments';

import { DwhRepository, IDwhRepository } from '../../repositories/DwhRepository';

export interface IDwhLoggingService {
  logPaymentIntent(event: PaymentObjectEventDetail): Promise<void>;
  logPaymentFailed(event: PaymentObjectEventDetail): Promise<void>;
  logPaymentSucceeded(event: PaymentObjectEventDetail): Promise<void>;
}

export class DwhLoggingService implements IDwhLoggingService {
  static readonly key = 'DwhPaymentService';
  static readonly inject = [DwhRepository.key] as const;

  constructor(private readonly dwhRepository: IDwhRepository) {}

  async logPaymentIntent(event: PaymentObjectEventDetail): Promise<void> {
    return await this.dwhRepository.logPaymentIntent(event);
  }

  async logPaymentFailed(event: PaymentObjectEventDetail): Promise<void> {
    return await this.dwhRepository.logPaymentFailed(event);
  }

  async logPaymentSucceeded(event: PaymentObjectEventDetail): Promise<void> {
    return await this.dwhRepository.logPaymentSucceeded(event);
  }
}
