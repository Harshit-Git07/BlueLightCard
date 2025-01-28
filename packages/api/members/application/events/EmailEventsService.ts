import { StreamRecord } from 'aws-lambda';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { hasAttributeChanged } from '@blc-mono/members/application/utils/dynamoDb/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { EventsService } from '@blc-mono/members/application/events/base/EventsService';

export class EmailEventsService extends EventsService {
  constructor() {
    super(EventBusSource.EMAIL);
  }

  public async emitEmailSignupEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.EMAIL_SIGNUP, dynamoStream);
  }

  public async emitCardCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.EMAIL_CARD_CREATED, dynamoStream);
  }

  public async emitApplicationUpdatedEvents(dynamoStream: StreamRecord | undefined): Promise<void> {
    const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);

    if (hasAttributeChanged('trustedDomainEmail', dynamoStream)) {
      await this.sendEventBusMessage(MemberEvent.EMAIL_TRUSTED_DOMAIN, dynamoStream);
    }

    if (
      hasAttributeChanged('eligibilityStatus', dynamoStream) &&
      newApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE
    ) {
      await this.sendEventBusMessage(MemberEvent.EMAIL_MEMBERSHIP_LIVE, dynamoStream);
    }

    if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      newApplication?.paymentStatus === PaymentStatus.PAID_PROMO_CODE
    ) {
      await this.sendEventBusMessage(MemberEvent.EMAIL_PROMO_PAYMENT, dynamoStream);
    }

    if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      (newApplication?.paymentStatus === PaymentStatus.PAID_CARD ||
        newApplication?.paymentStatus === PaymentStatus.PAID_PAYPAL ||
        newApplication?.paymentStatus === PaymentStatus.PAID_CHEQUE ||
        newApplication?.paymentStatus === PaymentStatus.PAID_ADMIN)
    ) {
      await this.sendEventBusMessage(MemberEvent.EMAIL_PAYMENT_MADE, dynamoStream);
    }
  }

  public async emitCardUpdatedEvents(dynamoStream: StreamRecord | undefined): Promise<void> {
    const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);

    if (
      hasAttributeChanged('cardStatus', dynamoStream) &&
      newCard?.cardStatus === CardStatus.PHYSICAL_CARD
    ) {
      await this.sendEventBusMessage(MemberEvent.EMAIL_CARD_POSTED, dynamoStream);
    }
  }
}
