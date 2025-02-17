import { StreamRecord } from 'aws-lambda';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { ApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { hasAttributeChanged } from '@blc-mono/members/application/services/events/utils/attibuteManagement';
import { unmarshallStreamImages } from '@blc-mono/members/application/utils/dynamoDb/unmarshallStreamImages';
import { EventsService } from '@blc-mono/members/application/services/events/base/EventsService';

let brazeEventsServiceSingleton: BrazeEventsService;

export class BrazeEventsService extends EventsService {
  constructor() {
    super(EventBusSource.BRAZE);
  }

  public async emitProfileCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.BRAZE_PROFILE_CREATED, dynamoStream);
  }

  public async emitApplicationCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.BRAZE_APPLICATION_CREATED, dynamoStream);
  }

  public async emitCardCreatedEvent(dynamoStream: StreamRecord | undefined): Promise<void> {
    await this.sendEventBusMessage(MemberEvent.BRAZE_CARD_CREATED, dynamoStream);
  }

  public async emitProfileUpdatedEvents(dynamoStream: StreamRecord | undefined): Promise<void> {
    if (
      hasAttributeChanged('firstName', dynamoStream) ||
      hasAttributeChanged('lastName', dynamoStream) ||
      hasAttributeChanged('dateOfBirth', dynamoStream) ||
      hasAttributeChanged('gender', dynamoStream) ||
      hasAttributeChanged('phoneNumber', dynamoStream) ||
      hasAttributeChanged('county', dynamoStream) ||
      hasAttributeChanged('email', dynamoStream) ||
      hasAttributeChanged('organisationId', dynamoStream) ||
      hasAttributeChanged('employerId', dynamoStream)
    ) {
      await this.sendEventBusMessage(MemberEvent.BRAZE_PROFILE_UPDATED, dynamoStream);
    }
  }

  public async emitApplicationUpdatedEvents(dynamoStream: StreamRecord | undefined): Promise<void> {
    const { newImage: newApplication } = unmarshallStreamImages<ApplicationModel>(dynamoStream);

    if (
      hasAttributeChanged('eligibilityStatus', dynamoStream) &&
      newApplication?.eligibilityStatus === EligibilityStatus.ELIGIBLE
    ) {
      await this.sendEventBusMessage(MemberEvent.BRAZE_APPLICATION_UPDATED, dynamoStream);
    }

    if (
      hasAttributeChanged('paymentStatus', dynamoStream) &&
      newApplication?.paymentStatus?.startsWith('PAID')
    ) {
      await this.sendEventBusMessage(MemberEvent.BRAZE_APPLICATION_UPDATED, dynamoStream);
    }
  }

  public async emitCardUpdatedEvents(dynamoStream: StreamRecord | undefined) {
    const { newImage: newCard } = unmarshallStreamImages<CardModel>(dynamoStream);

    if (
      hasAttributeChanged('cardStatus', dynamoStream) &&
      (newCard?.cardStatus === CardStatus.AWAITING_POSTAGE ||
        newCard?.cardStatus === CardStatus.PHYSICAL_CARD ||
        newCard?.cardStatus === CardStatus.CARD_LOST ||
        newCard?.cardStatus === CardStatus.DISABLED ||
        newCard?.cardStatus === CardStatus.CARD_EXPIRED)
    ) {
      await this.sendEventBusMessage(MemberEvent.BRAZE_CARD_UPDATED, dynamoStream);
    }

    if (hasAttributeChanged('expiryDate', dynamoStream)) {
      await this.sendEventBusMessage(MemberEvent.BRAZE_CARD_UPDATED, dynamoStream);
    }

    if (hasAttributeChanged('paymentStatus', dynamoStream)) {
      if (newCard?.paymentStatus === PaymentStatus.REFUNDED) {
        await this.sendEventBusMessage(MemberEvent.BRAZE_CARD_UPDATED, dynamoStream);
      }
    }
  }
}

export function brazeEventsService(): BrazeEventsService {
  if (!brazeEventsServiceSingleton) {
    brazeEventsServiceSingleton = new BrazeEventsService();
  }

  return brazeEventsServiceSingleton;
}
