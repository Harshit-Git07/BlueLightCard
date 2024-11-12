import { PaymentEvent } from '../../models/paymentEvent';
import {
  IPaymentEventStoreRepository,
  PaymentEventStoreRepository,
} from '../../repositories/PaymentEventStoreRepository';

export interface IPaymentEventsService {
  getPaymentEvents(memberId: string): Promise<PaymentEvent[]>;
}

export class PaymentEventsService implements IPaymentEventsService {
  static readonly key = 'PaymentEventsService';
  static readonly inject = [PaymentEventStoreRepository.key] as const;

  constructor(private readonly paymentEventStoreRepository: IPaymentEventStoreRepository) {}

  async getPaymentEvents(memberId: string): Promise<PaymentEvent[]> {
    return await this.paymentEventStoreRepository.queryPaymentEventsByMemberId(memberId);
  }
}
