import { CardStatus } from 'application/enums/CardStatus';
import { PaymentStatus } from 'application/enums/PaymentStatus';

export interface MemberCardQueryPayload {
  brand: string;
  uuid: string;
  cardNumber?: string;
}

export interface MemberCardUpdatePayload {
  card_status?: CardStatus;
  name_on_card?: string;
  expiry_date?: string;
  posted_date?: string;
  purchase_time?: string;
  payment_status?: PaymentStatus;
  batch_number?: string;
}
